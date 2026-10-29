// Sistem terjemahan dinamis untuk Paperlisens
// Sekarang lebih difokuskan pada UI umum karena data produk sudah memiliki terjemahan permanen.

export const translationMap: any = {
  en: {
    'terjual': 'sold',
    'Pcs': 'Pcs',
    'Pack': 'Pack'
  },
  zh: {
    'terjual': '已售',
    'Pcs': '个',
    'Pack': '包'
  }
};

export function getSmartTranslation(text: string, locale: string): string {
  if (!text || locale === 'id') return text;
  
  // Jika teks sudah terjemahan (tidak ada di map tapi locale bukan ID), kembalikan apa adanya.
  const map = translationMap[locale];
  if (!map) return text;
  
  let translatedText = text;
  const keys = Object.keys(map);
  
  for (const key of keys) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    translatedText = translatedText.replace(regex, map[key]);
  }
  
  return translatedText;
}
