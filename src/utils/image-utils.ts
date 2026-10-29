/**
 * Utility for client-side image compression and WebP conversion.
 * Adapted from the image-compressor tool.
 */

export const compressToWebP = (file: File, quality: number = 0.8): Promise<Blob | null> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(null);
                    return;
                }
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/webp', quality);
            };
            img.onerror = () => resolve(null);
        };
        reader.onerror = () => resolve(null);
    });
};

/**
 * Auto-compresses an image to be under a target size (in MB)
 */
export const smartCompressToWebP = async (file: File, targetSizeMB: number = 0.5): Promise<Blob | null> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(null);
                    return;
                }
                ctx.drawImage(img, 0, 0);

                const targetBytes = targetSizeMB * 1024 * 1024;

                // Binary search for best quality
                let minQ = 0.05;
                let maxQ = 0.95;
                let bestBlob: Blob | null = null;

                // Try high quality first
                const highQBlob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/webp', 0.9));
                if (highQBlob && highQBlob.size <= targetBytes) {
                    resolve(highQBlob);
                    return;
                }

                // Binary search iterations
                for (let i = 0; i < 6; i++) {
                    const midQ = (minQ + maxQ) / 2;
                    const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/webp', midQ));

                    if (blob) {
                        if (blob.size <= targetBytes) {
                            bestBlob = blob;
                            minQ = midQ;
                        } else {
                            maxQ = midQ;
                        }
                    }
                }

                resolve(bestBlob || await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/webp', minQ)));
            };
            img.onerror = () => resolve(null);
        };
        reader.onerror = () => resolve(null);
    });
};
