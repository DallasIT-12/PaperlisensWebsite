export interface Product {
  id: string;
  slug: string;
  translationKey: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  brand: string;
  finishing: string;
  flavor: string;
  packSize: string;
}

export const customBoxProducts: Product[] = [
  //PREMIUM (2-3 finishing)
  {
    id: '1',
    slug: 'premium-emboss-hotprint-spot-uv',
    translationKey: 'premiumFull',
    name: 'Premium Box - Emboss + Hotprint + Spot UV',
    description: 'Kemasan premium dengan 3 finishing: emboss untuk efek timbul, hotprint foil metalik, dan spot UV untuk kilau di area tertentu.',
    price: 0,
    image: '/kotak rokok 1.webp',
    category: 'Premium',
    subcategory: 'Cigarette',
    brand: 'Dallas Custom',
    finishing: 'Emboss + Hotprint + Spot UV',
    flavor: 'Logo timbul, foil metalik kilau, dan glossy pada area tertentu',
    packSize: '10000 pcs'
  },
  {
    id: '2',
    slug: 'premium-emboss-hotprint',
    translationKey: 'premiumEmbossHotprint',
    name: 'Premium Box - Emboss + Hotprint',
    description: 'Kemasan premium dengan 2 finishing: emboss untuk efek timbul dan hotprint foil metalik untuk kilau emas/perak.',
    price: 0,
    image: '/kotak rokok 1.webp',
    category: 'Premium',
    subcategory: 'Cigarette',
    brand: 'Dallas Custom',
    finishing: 'Emboss + Hotprint',
    flavor: 'Logo timbul dan foil metalik kilau',
    packSize: '10000 pcs'
  },
  {
    id: '3',
    slug: 'premium-hotprint-spot-uv',
    translationKey: 'premiumHotprintSpotUV',
    name: 'Premium Box - Hotprint + Spot UV',
    description: 'Kemasan premium dengan 2 finishing: hotprint foil metalik dan spot UV untuk efek glossy kontras pada logo.',
    price: 0,
    image: '/kotak rokok 1.webp',
    category: 'Premium',
    subcategory: 'Cigarette',
    brand: 'Dallas Custom',
    finishing: 'Hotprint + Spot UV',
    flavor: 'Foil metalik kilau dan glossy pada area logo',
    packSize: '10000 pcs'
  },

  //STANDARD (1 finishing)
  {
    id: '4',
    slug: 'standard-finishing-emboss',
    translationKey: 'standardEmboss',
    name: 'Standard Box - Finishing Emboss',
    description: 'Kemasan standar dengan finishing emboss, membuat logo dan desain tampil timbul (arise) untuk kesan elegan.',
    price: 0,
    image: '/kotak rokok 1.webp',
    category: 'Standard',
    subcategory: 'Cigarette',
    brand: 'Dallas Custom',
    finishing: 'Emboss',
    flavor: 'Logo dan desain tampil timbul / arise',
    packSize: '10000 pcs'
  },
  {
    id: '5',
    slug: 'standard-finishing-hotprint',
    translationKey: 'standardHotprint',
    name: 'Standard Box - Finishing Hotprint',
    description: 'Kemasan standar dengan finishing hotprint, menghasilkan efek foil metalik kilau pada logo dan teks.',
    price: 0,
    image: '/kotak rokok 1.webp',
    category: 'Standard',
    subcategory: 'Cigarette',
    brand: 'Dallas Custom',
    finishing: 'Hotprint',
    flavor: 'Efek foil metalik kilau pada logo dan teks',
    packSize: '10000 pcs'
  },
  {
    id: '6',
    slug: 'standard-finishing-spot-uv',
    translationKey: 'standardSpotUV',
    name: 'Standard Box - Finishing Spot UV',
    description: 'Kemasan standar dengan finishing spot UV, memberikan lapisan glossy mengkilap pada area tertentu seperti logo.',
    price: 0,
    image: '/kotak rokok 1.webp',
    category: 'Standard',
    subcategory: 'Cigarette',
    brand: 'Dallas Custom',
    finishing: 'Spot UV',
    flavor: 'Lapisan glossy mengkilap pada area tertentu',
    packSize: '10000 pcs'
  },
  {
    id: '7',
    slug: 'standard-finishing-uv',
    translationKey: 'standardUV',
    name: 'Standard Box - Finishing UV',
    description: 'Kemasan standar dengan UV coating merata di seluruh permukaan, warna lebih cerah dan tahan gores.',
    price: 0,
    image: '/kotak rokok 1.webp',
    category: 'Standard',
    subcategory: 'Cigarette',
    brand: 'Dallas Custom',
    finishing: 'UV',
    flavor: 'Lapisan pelindung glossy merata, warna lebih cerah',
    packSize: '10000 pcs'
  },

  //GENERAL (no finishing)
  {
    id: '8',
    slug: 'general-box',
    translationKey: 'generalBox',
    name: 'General Box - Tanpa Finishing',
    description: 'Kemasan kotak rokok standar tanpa finishing tambahan. Cocok untuk kebutuhan kemasan dasar dengan harga terjangkau.',
    price: 0,
    image: '/kotak rokok 1.webp',
    category: 'General',
    subcategory: 'Cigarette',
    brand: 'Dallas Custom',
    finishing: '-',
    flavor: 'Kemasan dasar tanpa finishing tambahan',
    packSize: '10000 pcs'
  }
];
