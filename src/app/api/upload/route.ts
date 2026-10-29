import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function getClient() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureBucketExists(supabase: any, bucket: string) {
  try {
    // @ts-ignore
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.warn('BUCKET_LIST_ERROR:', error.message);
      return;
    }
    const exists = buckets?.some((b: any) => b.id === bucket || b.name === bucket);
    if (!exists) {
      console.log(`BUCKET_NOT_FOUND: "${bucket}" not found. Creating...`);
      // @ts-ignore
      const { error: createErr } = await supabase.storage.createBucket(bucket, { public: true });
      if (createErr) {
        console.error('BUCKET_CREATE_ERROR:', createErr.message);
      } else {
        console.log(`BUCKET_CREATED: "${bucket}" created successfully.`);
      }
    } else {
      console.log(`BUCKET_OK: "${bucket}" exists.`);
    }
  } catch (e) {
    console.error('BUCKET_CHECK_FATAL:', e);
  }
}

export async function POST(request: NextRequest) {
  console.log('--- SUPABASE UPLOAD START ---');
  try {
    const supabase = getClient();
    if (!supabase) {
      console.error('UPLOAD_ERROR: Supabase client is not configured. Check env variables.');
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string || 'products';

    if (!file) {
      console.warn('UPLOAD_WARNING: No file received in formData.');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // File size check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      console.warn(`UPLOAD_WARNING: File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB > ${MAX_FILE_SIZE_MB}MB`);
      return NextResponse.json({ error: `File too large. Max size is ${MAX_FILE_SIZE_MB}MB.` }, { status: 413 });
    }

    console.log(`FILE_INFO: name="${file.name}", type="${file.type}", size=${(file.size / 1024).toFixed(1)}KB`);
    console.log(`TARGET_BUCKET: "${bucket}"`);

    // Ensure bucket exists — auto-create if missing
    await ensureBucketExists(supabase, bucket);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = `${fileName}`;

    console.log(`UPLOADING_TO_SUPABASE: ${filePath}...`);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      console.error('SUPABASE_STORAGE_ERROR:', JSON.stringify(error, null, 2));
      return NextResponse.json({
        error: error.message,
        details: {
          status: (error as any).status,
          statusCode: (error as any).statusCode,
          name: (error as any).name,
        }
      }, { status: 500 });
    }

    console.log('SUPABASE_UPLOAD_SUCCESS:', data.path);

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log(`GENERATED_PUBLIC_URL: ${publicUrl}`);
    console.log('--- SUPABASE UPLOAD END ---');

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error('UPLOAD_FATAL_ERROR:', err);
    return NextResponse.json({ error: 'Upload failed', details: String(err) }, { status: 500 });
  }
}

// DELETE /api/upload — remove a file from Supabase Storage by its public URL
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { url, bucket: bucketParam } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // Only delete files that are actually hosted on Supabase Storage
    // (ignore local paths like /placeholder.png, /food%20wrapper%20(1).webp, etc.)
    if (!url.includes('/storage/v1/object/public/')) {
      // (Skipping log to keep server output clean)
      return NextResponse.json({ skipped: true, reason: 'Not a Supabase Storage URL' });
    }

    // Extract bucket name and file path from URL
    // URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const storageBase = '/storage/v1/object/public/';
    const afterBase = url.substring(url.indexOf(storageBase) + storageBase.length);
    const slashIdx = afterBase.indexOf('/');
    const bucket = bucketParam || (slashIdx !== -1 ? afterBase.substring(0, slashIdx) : afterBase);
    const filePath = slashIdx !== -1 ? afterBase.substring(slashIdx + 1) : '';

    if (!filePath) {
      console.warn(`STORAGE_DELETE_WARN: Could not extract file path from URL: ${url}`);
      return NextResponse.json({ error: 'Could not extract file path' }, { status: 400 });
    }

    console.log(`STORAGE_DELETE: bucket="${bucket}", path="${filePath}"`);

    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error('STORAGE_DELETE_ERROR:', error.message);
      // Treat "not found" as success (file was already deleted or never existed)
      if (error.message?.toLowerCase().includes('not found') || (error as any).statusCode === '404') {
        return NextResponse.json({ deleted: true, note: 'File was already gone' });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`STORAGE_DELETE_SUCCESS: "${filePath}" removed from "${bucket}"`);
    return NextResponse.json({ deleted: true, path: filePath });
  } catch (err) {
    console.error('STORAGE_DELETE_FATAL:', err);
    return NextResponse.json({ error: 'Delete failed', details: String(err) }, { status: 500 });
  }
}
