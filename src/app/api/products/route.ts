export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Static product data (database-free)
    const allProducts = [
      { 
        id: 1, 
        name: 'Cup A Premium - Paper Cup 8oz Putih', 
        price: 95000, 
        originalPrice: 95000, 
        discount: 10, 
        rating: 4.8, 
        sold: 3200, 
        image: 'https://images.unsplash.com/photo-1577303935007-0d306ee134d2?w=300&h=200&fit=crop',
        category: 'cup-a',
        location: 'Jakarta Pusat',
        stock: 125,
        unit: 'per 1000 pcs',
        isActive: true
      },
      { 
        id: 2, 
        name: 'Cup B Standard - Paper Cup 12oz Coklat', 
        price: 135000, 
        originalPrice: 135000, 
        discount: 10, 
        rating: 4.7, 
        sold: 2800, 
        image: 'https://images.unsplash.com/photo-1577303935007-0d306ee134d2?w=300&h=200&fit=crop',
        category: 'cup-b',
        location: 'Bandung',
        stock: 95,
        unit: 'per 1000 pcs',
        isActive: true
      },
      { 
        id: 3, 
        name: 'Cup C Large - Paper Cup 16oz Premium', 
        price: 175000, 
        originalPrice: 175000, 
        discount: 10, 
        rating: 4.9, 
        sold: 1950, 
        image: 'https://images.unsplash.com/photo-1577303935007-0d306ee134d2?w=300&h=200&fit=crop',
        category: 'cup-c',
        location: 'Surabaya',
        stock: 75,
        unit: 'per 1000 pcs',
        isActive: true
      },
      { 
        id: 4, 
        name: 'Cup D Extra Large - Paper Cup 22oz Jumbo', 
        price: 210000, 
        originalPrice: 210000, 
        discount: 10, 
        rating: 4.6, 
        sold: 1200, 
        image: 'https://images.unsplash.com/photo-1577303935007-0d306ee134d2?w=300&h=200&fit=crop',
        category: 'cup-d',
        location: 'Yogyakarta',
        stock: 60,
        unit: 'per 1000 pcs',
        isActive: true
      },
      { 
        id: 5, 
        name: 'Cup Toast - Food Container Persegi Kecil', 
        price: 110000, 
        originalPrice: 110000, 
        discount: 10, 
        rating: 4.5, 
        sold: 2670, 
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
        category: 'cup-toast',
        location: 'Malang',
        stock: 85,
        unit: 'per 500 pcs',
        isActive: true
      },
      { 
        id: 6, 
        name: 'Cup Toast Es - Food Container dengan Tutup', 
        price: 145000, 
        originalPrice: 145000, 
        discount: 10, 
        rating: 4.7, 
        sold: 1850, 
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
        category: 'cup-toast-es',
        location: 'Semarang',
        stock: 70,
        unit: 'per 500 pcs',
        isActive: true
      },
      { 
        id: 7, 
        name: 'Cup A Mini - Paper Cup 4oz untuk Espresso', 
        price: 75000, 
        originalPrice: 75000, 
        discount: 10, 
        rating: 4.4, 
        sold: 1950, 
        image: 'https://images.unsplash.com/photo-1577303935007-0d306ee134d2?w=300&h=200&fit=crop',
        category: 'cup-a',
        location: 'Jakarta Selatan',
        stock: 150,
        unit: 'per 1000 pcs',
        isActive: true
      },
      { 
        id: 8, 
        name: 'Cup Toast Es Premium - Leak Proof Container', 
        price: 185000, 
        originalPrice: 185000, 
        discount: 10, 
        rating: 4.8, 
        sold: 890, 
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
        category: 'cup-toast-es',
        location: 'Denpasar',
        stock: 45,
        unit: 'per 500 pcs',
        isActive: true
      }
    ];

    // Filter by category if provided
    const products = category 
      ? allProducts.filter(product => product.category === category)
      : allProducts;

    return NextResponse.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
