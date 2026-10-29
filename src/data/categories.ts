export interface Category {
  title: string;
  slug: string;
  img: string;
  desc: string;
  tags?: string[];
  video?: string;
  gallery: string[];
  explanation: string;
  applications: string[];
  commonMaterials?: string[];
  isMaterial?: boolean;
  varieties?: string[];
}

export const getDallasCategories = (tCat: any, tMaterials: any): Category[] => [
  {
    title: tCat('hampers.title'),
    slug: "kotak-hampers",
    img: "/kotak%20hampers.webp",
    desc: tCat('hampers.desc'),
    tags: [tCat('hampers.tags.tag1'), tCat('hampers.tags.tag2')],
    video: "/video-box-hampers.webm",
    gallery: [
      "/box%20hampers%20(1).webp", "/box%20hampers%20(4).webp", "/box%20hampers%20(5).webp",
      "/box%20hampers.webp",
      "/box%20hampers%20kraft%20(1).webp", "/box%20hampers%20kraft%20(2).webp", "/box%20hampers%20kraft%20(3).webp",
      "/box%20hampers%20natal%20(1).webp", "/box%20hampers%20natal%20(2).webp", "/box%20hampers%20natal%20(3).webp",
      "/gable%20box%20(1).webp", "/gable%20box%20(10).webp", "/gable%20box%20(11).webp", "/gable%20box%20(12).webp",
      "/gable%20box%20(13).webp", "/gable%20box%20(15).webp", "/gable%20box%20(16).webp",
      "/gable%20box%20(17).webp", "/gable%20box%20(2).webp",
      "/gable%20box%20idul%20fitri%20(1).webp", "/gable%20box%20idul%20fitri%20(2).webp",
      "/gable%20box%20idul%20fitri%20(4).webp", "/gable%20box%20idul%20fitri%20(5).webp",
      "/gable%20box%20idul%20fitri%20(6).webp", "/gable%20box%20idul%20fitri%20(7).webp",
      "/hardbox%20(1).webp", "/hardbox%20(2).webp", "/hardbox%20(3).webp", "/kotak%20hampers.webp"
    ],
    explanation: "Secara umum, kotak hampers adalah kemasan khusus yang dirancang untuk menampung, menyusun, dan mempresentasikan koleksi berbagai produk (seperti makanan, minuman, kain, atau cendera mata). selain untuk mempercantik tampilan parsel, kotak hampers juga bisa menjadi media branding yang kuat untuk bisnis toko kue atau perusahaan yang memberikan Berbeda dengan kotak biasa, kotak hampers memiliki beberapa karakteristik Utama yaitu fokus Utama pada estetika karena kotak ini berfungsi sebagai nilai jual agar terkesan mewah dari isi di dalamnya. kotak ini juga memiliki bahan yang lebih kokoh karena digunakan untuk menampung lebih dari satu jenis barang dengan berat yang bervariasi. selain itu kotak hampers juga biasanya bisa digunakan Kembali oleh penerima karena daya tahan yang baik. di dallas kami menerima berbagai macam bentuk varian kotak hampers sesuai keinginan pelanggan, dari yang kecil hingga besar, pure hand made sehingga menghasilkan kotak hampers yang mewah dan elegan",
    applications: ["Parsel Lebaran / Idul Fitri", "Hampers pernikahan & souvenir", "Hampers Natal & Tahun Baru", "Gift box corporate / perusahaan", "Bingkisan ulang tahun premium"],
    commonMaterials: ["Art Carton", "Ivory Paper", "Art Paper", "Corrugated Board"]
  },
  {
    title: tCat('bakery.title'),
    slug: "kotak-bakery",
    img: "/foto_bakery_1.webp",
    desc: tCat('bakery.desc'),
    tags: [tCat('bakery.tags.tag1'), tCat('bakery.tags.tag2')],
    gallery: [
      "/foto_bakery_1.webp", "/foto_bakery_2.webp", "/foto_bakery_3.webp",
      "/box%20bakery%20(1).webp", "/box%20bakery%20(2).webp", "/box%20bakery%20(3).webp",
      "/box%20bakery%20(4).webp", "/box%20bakery%20(5).webp", "/box%20bakery%20(6).webp",
      "/box%20bakery%20(7).webp", "/box%20bakery.webp",
      "/box%20donat%20motif%20(1).webp", "/box%20donat%20motif%20(2).webp",
      "/box%20donat%20motif%20(3).webp",
      "/box%20donat%20motif%20(4).webp", "/box%20donat%20motif%20(5).webp",
      "/box%20donat%20motif%20(6).webp", "/box%20donat%20motif.webp", "/box%20roti%20bakar%20(1).webp",
      "/box%20roti%20bakar%20(2).webp", "/box%20roti%20bakar%20(3).webp", "/box%20slice%20cake-1.webp",
      "/box%20slice%20cake-2.webp", "/box%20slice%20cake.webp", "/box%20tart%20handle%20(1).webp",
      "/box%20tart%20handle%20(2).webp", "/box%20tart%20handle%20(3).webp", "/box%20tart%20handle%20(4).webp",
      "/box%20tart%20handle%20(5).webp", "/box%20tart%20handle%20(6).webp", "/cheese%20cake%20(1).webp",
      "/cheese%20cake%20(2).webp", "/cheese%20cake%20(3).webp", "/cheese%20cake%20(4).webp",
      "/cupcake%20isi%2012%20(1).webp", "/cupcake%20isi%2012%20(2).webp", "/cupcake%20isi%2012%20(3).webp",
      "/cupcake%20isi%2012%20(4).webp", "/cupcake%20isi%2012%20(5).webp", "/cupcake%20isi%2012%20(6).webp",
      "/cupcake%20isi%2016%20(1).webp", "/cupcake%20isi%2016%20(2).webp", "/cupcake%20isi%2016%20(3).webp",
      "/cupcake%20isi%2016%20(4).webp", "/cupcake%20isi%2016%20(5).webp", "/cupcake%20isi%204%20(1).webp",
      "/cupcake%20isi%204%20(2).webp", "/cupcake%20isi%204%20(3).webp", "/cupcake%20isi%204%20(4).webp",
      "/cupcake%20isi%204%20motif%20(1).webp", "/cupcake%20isi%204%20motif%20(2).webp", "/cupcake%20isi%204%20motif%20(3).webp",
      "/cupcake%20isi%204%20motif%20(4).webp", "/cupcake%20isi%204%20motif%20(5).webp", "/cupcake%20isi%206%20(1).webp",
      "/cupcake%20isi%206%20(2).webp", "/cupcake%20isi%206%20(3).webp", "/cupcake%20isi%209%20(1).webp",
      "/cupcake%20isi%209%20(2).webp", "/cupcake%20isi%209%20(3).webp", "/cupcake%20isi%209%20(4).webp",
      "/cupcake%20isi%209%20(5).webp", "/cupcake%20isi%209%20(6).webp", "/cupcake%20isi%209%20(7).webp",
      "/cupcake%20isi%209%20(8).webp", "/cupcake%20isi%209%20(9).webp", "/dallas%20donat%20isi%203.webp",
      "/dallas%20donat%20isi%206.webp", "/donat%20isi%201(1).webp", "/donat%20isi%201(2).webp", "/donat%20isi%201.webp",
      "/kotak%20cake.webp", "/kotak%20cupcake%20isi%204%20(1).webp", "/kotak%20cupcake%20isi%204%20(2).webp",
      "/kotak%20cupcake%20isi%204%20(3).webp", "/kotak%20cupcake%20isi%204%20(4).webp", "/kotak%20cupcake%20isi%204%20(5).webp",
      "/kotak%20cupcake%20isi%204%20(6).webp", "/kotak%20cupcake%20isi%204%20(7).webp", "/kotak%20cupcake%20isi%206%20(1).webp",
      "/kotak%20cupcake%20isi%206%20(2).webp", "/kotak%20cupcake%20isi%206%20(3).webp", "/kotak%20cupcake%20isi%206%20(4).webp",
      "/kotak%20cupcake%20motif%20isi%201%20(1).webp", "/kotak%20cupcake%20motif%20isi%201%20(2).webp",
      "/kotak%20rollcake%20(1).webp", "/kotak%20rollcake%20(2).webp", "/kotak%20rollcake%20(3).webp",
      "/kotak%20rollcake%20(4).webp", "/kotak%20rollcake%20(5).webp", "/kotak%20rollcake%20(6).webp",
      "/kotak%20rollcake%20(7).webp", "/kotak%20rollcake%20(8).webp", "/kotak%20rollcake%20(9).webp",
      "/kotak%20rollcake%20mika%20(1).webp", "/kotak%20rollcake%20mika%20(2).webp", "/kotak%20rollcake%20mika%20(3).webp",
      "/kotak%20rollcake%20mika%20(4).webp", "/paperlisens%20cupcake.webp"
    ],
    explanation: "Kotak Bakery adalah kemasan fungsional sekaligus estetis yang dirancang untuk melindungi produk roti, kue, dan pastry agar tetap segar, rapi, dan menarik. Kemasan ini harus tahan terhadap minyak dan kelembapan sambil tetap menampilkan desain yang menggugah selera. Bagi pelaku usaha bakery, kotak custom adalah investasi branding yang membuat produk tampil lebih profesional dan meningkatkan nilai jual.",
    applications: ["Box kue ulang tahun", "Kotak donat & cupcake", "Box roti tawar & pastry", "Kemasan brownies & cookies", "Box tart & pie premium"],
    commonMaterials: ["Ivory Paper (Food Grade)", "Duplex", "Food Grade Paper", "Art Carton"]
  },
  {
    title: tCat('rokok.title'),
    slug: "rokok",
    img: "/foto_rokok_1.webp",
    desc: tCat('rokok.desc'),
    tags: [tCat('rokok.tags.tag1'), tCat('rokok.tags.tag2')],
    gallery: [
      "/foto_rokok_1.webp", "/foto_rokok_2.webp", "/foto_rokok_3.webp", "/foto_rokok_4.webp",
      "/foto_rokok_5.webp", "/foto_rokok_6.webp", "/foto_rokok_7.webp", "/foto_rokok_8.webp",
      "/custom%20rokok%20(1).webp", "/custom%20rokok%20(10).webp", "/custom%20rokok%20(11).webp",
      "/custom%20rokok%20(12).webp", "/custom%20rokok%20(13).webp", "/custom%20rokok%20(14).webp",
      "/custom%20rokok%20(15).webp", "/custom%20rokok%20(16).webp", "/custom%20rokok%20(17).webp",
      "/custom%20rokok%20(18).webp", "/custom%20rokok%20(19).webp", "/custom%20rokok%20(2).webp",
      "/custom%20rokok%20(20).webp", "/custom%20rokok%20(21).webp", "/custom%20rokok%20(22).webp",
      "/custom%20rokok%20(23).webp", "/custom%20rokok%20(24).webp", "/custom%20rokok%20(3).webp",
      "/custom%20rokok%20(4).webp", "/custom%20rokok%20(5).webp", "/custom%20rokok%20(6).webp",
      "/custom%20rokok%20(7).webp", "/custom%20rokok%20(8).webp", "/custom%20rokok%20(9).webp",
      "/custom%20rokok%201.webp", "/custom%20rokok%202.webp", "/custom%20rokok%203.webp",
      "/custom%20rokok%204.webp", "/custom%20rokok.webp", "/foto%20rokok%201.webp",
      "/foto%20rokok.webp", "/kotak%20rokok%201.webp"
    ],
    explanation: "Secara umum, kotak rokok adalah wadah atau kemasan fungsional yang dirancang khusus untuk menyimpan, melindungi, dan menjaga kualitas produk tembakau (rokok) di dalamnya selama proses distribusi hingga sampai ke tangan konsumen. fungsi spesifik dari kotak rokok adalah untuk menjaga agar batang rokok tidak patah, tidak hancur, dan terlindungi dari Udara yang dapat merusak rasa/aroma. selain itu sebagai identitas visual dan sebuah branding Utama untuk membedakan dengan merek lain. menjadi media untuk menampilkan informasi legal yang telah ditetapkan oleh pemerintah seperti peringatan Kesehatan bergambar, informasi kandungan tar/nikotin, dan tempat peletakan pita cukai. kotak rokok dibuat untuk menampung rokok dalam jumlah tertentu umumnya 12,16 dan 20 batang agar mudah dibawa dalam saku. Didalam dunia rokok, kotak rokok menjadi satu standar tertinggi dalam kualitas cetak karena membutuhkan presisi ukuran dan detail kecil yang sangat rumit. Di dallas telah mencetak jutaan kotak rokok dengan berbagai desain dari yang mudah hingga rumit, semua telah melewati proses standar pabrik guna memberikan hasil yang memuaskan",
    applications: ["Kemasan rokok kretek", "Kemasan rokok filter", "Kemasan cigarillo & cerutu", "Box rokok edisi terbatas / limited edition", "Packaging rokok elektrik (pod)"],
    commonMaterials: ["Ivory Paper", "Tipping Paper", "SBS (Solid Bleached Sulfate) Board", "Inner Frame Board"]
  },
  {
    title: tCat('nasi.title'),
    slug: "kotak-nasi",
    img: "/foto_ricebox.webp",
    desc: tCat('nasi.desc'),
    tags: [tCat('nasi.tags.tag1'), tCat('nasi.tags.tag2')],
    gallery: [
      "/foto_ricebox.webp",
      "/box%20nasi%20(1).webp", "/box%20nasi%20(2).webp", "/box%20nasi%20(3).webp", "/box%20nasi%20(4).webp",
      "/kotak%20nasi%20(1).webp", "/kotak%20nasi%20(2).webp", "/kotak%20nasi%20(3).webp",
      "/kotak%20nasi%20(4).webp", "/kotak%20nasi%20(5).webp", "/kotak%20nasi%20(6).webp",
      "/kotak%20nasi%20(7).webp", "/kotak%20nasi%20(8).webp", "/kotak%20nasi%20(9).webp"
    ],
    explanation: "Secara umum, kotak nasi adalah kemasan fungsional yang dirancang khusus untuk menyimpan, melindungi, dan menyajikan satu porsi hidangan lengkap (biasanya terdiri dari nasi dan lauk-pauk) secara praktis dan higienis. di dallas kotak nasi memakai bahan food-grade, bahan ini dirancang untuk bersentuhan langsung dan yang pasti aman untuk makanan. bahan food-grade ini tahan terhadap minyak, air, dan uap panas. selain sebagai media untuk menyajikan makanan, kotak nasi juga dapat berfungsi sebagai media branding yang efektif. pencetakan logo, nama menu, alamat hingga media sosial dapat ditaruh di kotak nasi ini. cetakkan segera produk makanan kalian dan jadikan brand makanan mu menjadi lebih dikenal oleh masyarakat sekitar. kami telah mencetak jutaan kotak nasi dari umkm hingga brand terkenal.",
    applications: ["Nasi kotak acara kantor & meeting", "Katering hajatan & pernikahan", "Kotak nasi acara keagamaan", "Prasmanan & buffet box", "Nasi tumpeng mini"],
    commonMaterials: ["Duplex", "Food Grade Paper", "Ivory Paper", "Kraft Paper"]
  },
  {
    title: tCat('buku.title'),
    slug: "buku",
    img: "/foto_buku.webp",
    desc: tCat('buku.desc'),
    tags: [tCat('buku.tags.tag1')],
    gallery: [
      "/foto_buku.webp",
      "/buku%20(1).webp", "/buku%20(2).webp", "/buku%20(3).webp",
      "/buku%20(4).webp", "/buku%20(5).webp", "/buku%20(6).webp",
      "/buku%20(7).webp", "/buku%20(8).webp", "/buku%20(9).webp", "/foto%20buku.webp"
    ],
    explanation: "Secara umum, buku adalah kumpulan lembaran kertas atau bahan lainnya yang dijilid menjadi satu pada salah satu sisinya dan berisi tulisan, gambar, atau informasi yang disusun secara sistematis untuk tujuan literasi, dokumentasi, atau edukasi. dallas juga menyediakan jasa cetak buku dengan Harga murah dan kualitas terbaik,",
    applications: ["Buku ajar & modul pembelajaran", "Novel & buku cerita", "Company profile & annual report", "Yearbook & buku wisuda", "Jurnal ilmiah & skripsi"],
    commonMaterials: ["HVS", "Art Paper", "Art Carton", "Ivory Paper", "Book Paper"]
  },
  {
    title: tCat('kalender.title'),
    slug: "kalender",
    img: "/foto_kalender.webp",
    desc: tCat('kalender.desc'),
    tags: [tCat('kalender.tags.tag1')],
    gallery: [
      "/foto_kalender.webp",
      "/foto%20kalender.webp", "/kalender%20(1).webp", "/kalender%20(2).webp",
      "/kalender%20(3).webp", "/kalender%20(4).webp", "/kalender.webp"
    ],
    explanation: "Secara umum, kalender adalah sistem pengorganisasian waktu yang dicetak untuk menampilkan hari, minggu, dan bulan dalam setahun, yang berfungsi sebagai alat bantu perencanaan, pengingat jadwal, serta manajemen waktu. selain itu kalender memiliki kegunaan lain seperti media promosi jangka panjang, kalender yang memiliki desain menarik dapat menjadi hadiah yang disukai penerima. dallas menyediakan jasa cetak untuk kalender custom sesuai dengan brand pelanggan dengan Harga murah dan kualitas yang baik.",
    applications: ["Kalender dinding perusahaan", "Kalender meja / duduk", "Kalender spiralwire premium", "Kalender poster", "Kalender custom foto / keluarga"],
    commonMaterials: ["Art Paper", "Art Carton", "Ivory Paper", "Spiralwire / Ring Jilid"]
  },
  {
    title: tCat('paperbag.title'),
    slug: "paperbag",
    img: "/paperbag.webp",
    desc: tCat('paperbag.desc'),
    tags: [tCat('paperbag.tags.tag1'), tCat('paperbag.tags.tag2')],
    gallery: [
      "/foto%20paperbag.webp", "/paperbag%20(1).webp", "/paperbag%20(2).webp",
      "/paperbag%20(3).webp", "/paperbag%20(4).webp", "/paperbag%20(5).webp",
      "/paperbag%20(6).webp", "/paperbag%20(7).webp", "/paperbag%20(8).webp", "/paperbag.webp"
    ],
    explanation: "Secara umum, paperbag (tas kertas) adalah wadah praktis berbahan dasar kertas yang dirancang untuk membawa barang belanjaan, produk, atau bingkisan dengan cara yang lebih estetik dan ramah lingkungan. custom paperbag juga memiliki fungsi sebagai media iklan berjalan sehingga Ketika pelanggan membawa paperbag ke berbagai tempat otomatis sekaligus membawa nama brand dari paperbag, selain itu paperbag sebagai pengganti plastik membuatnya menjadi ramah lingkungan karena bahan nya yang mudah terurai. dapatkan custom paperbag dengan logo brand mu di dallas dengan kualitas terbaik dan Harga yang terjangkau.",
    applications: ["Shopping bag toko fashion & retail", "Paperbag event & launching produk", "Paperbag seminar & konferensi", "Goodie bag hadiah", "Paperbag restoran & coffee shop"],
    commonMaterials: ["Ivory Paper", "Art Paper", "Kraft Paper", "Art Carton"]
  },
  {
    title: tCat('map.title'),
    slug: "map",
    img: "/map.webp",
    desc: tCat('map.desc'),
    tags: [tCat('map.tags.tag1'), tCat('map.tags.tag2')],
    gallery: [
      "/map%20(1).webp", "/map%20(10).webp", "/map%20(11).webp", "/map%20(2).webp",
      "/map%20(3).webp", "/map%20(4).webp", "/map%20(5).webp", "/map%20(6).webp",
      "/map%20(7).webp", "/map%20(8).webp", "/map%20(9).webp", "/map.webp"
    ],
    explanation: "Secara umum, map adalah wadah berbentuk sampul keras atau semi-keras yang dirancang untuk menyimpan, melindungi, dan mengorganisir dokumen atau berkas penting agar tetap rapi dan tidak tercecer. disisi lain map juga berfungsi sebagai corporate identity, penggunaan map khusus saat memberikan kontrak, proposal, atau materi seminar yang mencerminkan keseriusan suatu instansi perusahaan. permukaan luar map dimanfaatkan sebagai media komunikasi visual yang menampilkan logo, alamat, visi perusahaan, hingga grafik yang memperkuat identitas merek. untuk mendapatkan custom map ini dallas menyediakan layanan custom map dengan Harga yang murah dan kualitas yang sempurna",
    applications: ["Map seminar & workshop", "Map raport / rapor sekolah", "Map ijazah & sertifikat", "Document folder perusahaan", "Map presentasi & proposal bisnis"],
    commonMaterials: ["Art Carton", "Ivory Paper", "BC (Board Coated)", "Linen Paper"]
  },
  {
    title: tCat('brosur.title'),
    slug: "brosur",
    img: "/foto%20brosur.webp",
    desc: tCat('brosur.desc'),
    tags: [tCat('brosur.tags.tag1')],
    gallery: ["/foto%20brosur.webp"],
    explanation: "Secara umum, brosur adalah media komunikasi cetak yang dirancang untuk menyampaikan informasi detail mengenai produk, layanan, atau acara dalam format yang ringkas, menarik, dan mudah dibawa. brosur memiliki penyampaian informasi yang terstruktur dan pembagian informasi yang lebih mendalam melalui berbagai jenis lipatan (seperti 2 lipat atau 3 lipat) yang berfungsi untuk mengorganisir konten secara sistematis. selain media untuk promosi brosur juga memiliki visual yang baik untuk mencerminkan branding yang kuat. dallas menyediakan cetak brosur dengan berbagai macam ukuran sesuai dengan keinginan pelanggan, dengan bahan art paper tentunya membuat brosur menjadi lebih menarik dilihat dan meningkatkan penjualan produk kalian.",
    applications: ["Brosur promosi produk & layanan", "Leaflet acara & event", "Flyer promo restoran & kafe", "Pamflet pendidikan & kesehatan", "Menu lipat restoran"],
    commonMaterials: ["Art Paper", "Ivory Paper", "HVS"]
  },

  // Materials with Detailed Info
  {
    title: tMaterials('artPaper.name'),
    slug: "art-paper",
    img: "/BAHAN-AP.webp",
    desc: tMaterials('artPaper.desc'),
    isMaterial: true,
    explanation: "Art Paper adalah jenis kertas dengan permukaan yang halus, licin, and mengkilap (glossy) di kedua sisinya. Kertas ini memiliki daya serap tinta yang rendah sehingga hasil cetakan terlihat sangat tajam dan vibrant.",
    applications: ["Brosur eksklusif", "Flyer promosi", "Katalog produk", "Isi buku atau majalah premium", "Kalender dinding"],
    varieties: ["100 gsm", "120 gsm", "150 gsm (Standar brosur premium)"],
    gallery: ["/BAHAN-AP.webp", "/foto%20brosur.webp"]
  },
  {
    title: tMaterials('ivoryPaper.name'),
    slug: "ivory-paper",
    img: "/BAHAN-IVORY.webp",
    desc: tMaterials('ivoryPaper.desc'),
    isMaterial: true,
    explanation: "Kertas Ivory adalah material 'all-in-one' yang menggabungkan karakteristik Art Carton dan BW. Satu sisinya memiliki coating glossy yang halus, sementara sisi lainnya doff (tanpa coating) namun tetap putih bersih.",
    applications: ["Box packaging skincare/kosmetik", "Paper bag premium", "Packaging makanan (Food Grade)", "Kotak obat-obatan", "Hangtag fashion"],
    varieties: ["210 gsm", "230 gsm", "250 gsm", "310 gsm (Paling populer untuk box)", "350 gsm"],
    gallery: ["/BAHAN-IVORY.webp", "/paperlisens%20produk%20unggulan%20(1).webp"]
  },
  {
    title: tMaterials('tipping.name'),
    slug: "bahan-tipping",
    img: "/BAHAN-TIPPING.webp",
    desc: tMaterials('tipping.desc'),
    isMaterial: true,
    explanation: "Tipping Paper adalah kertas khusus industri yang didesain dengan ketahanan tinggi dan tekstur spesifik. Di Dallas, kami menguasai kategori ini dengan spesifikasi teknis yang sangat presisi.",
    applications: ["Pembungkus filter rokok (filter wrapping)", "Segel kemasan khusus", "Komponen teknis produk tembakau"],
    varieties: ["Standard White", "Cork Pattern (Motif kayu)", "Custom Printing dengan logo/poly"],
    gallery: ["/BAHAN-TIPPING.webp"]
  },
  {
    title: tMaterials('duplex.name'),
    slug: "duplex",
    img: "/BAHAN-DC.webp",
    desc: tMaterials('duplex.desc'),
    isMaterial: true,
    explanation: "Kertas Duplex (Duplex Board) memiliki ciri khas perbedaan warna di kedua sisinya: satu sisi putih (coated) untuk area cetak, dan sisi lainnya abu-abu (uncoated). Sangat ekonomis dan kokoh.",
    applications: ["Box martabak & nasi", "Packaging produk massal", "Alas kue", "Box kemasan sparepart", "Packaging mainan"],
    varieties: ["250 gsm", "310 gsm", "400 gsm (Sangat tebal dan kaku)"],
    gallery: ["/BAHAN-DC.webp"]
  },
  {
    title: tMaterials('kraftPaper.name'),
    slug: "kraft-paper",
    img: "/A4_Brown_Krafting_Paper.jpg",
    desc: tMaterials('kraftPaper.desc'),
    isMaterial: true,
    explanation: "Kertas Kraft merupakan pilihan material yang sangat populer dalam dunia packaging karena kombinasi kekuatan, estetika klasik, dan ramah lingkungan. Kraft paper memiliki karakteristik warna coklat alaminya yang memberikan kesan organik dan rustic. Selain tahan lama karena terbuat dari proses pulp sulfat, kertas ini juga sangat fleksibel dan eco-friendly (mudah terurai/biodegradable).",
    applications: ["Paper bag / kantong belanja", "Kemasan makanan eco-friendly", "Box hampers premium", "Label dan hang tag", "Kemasan kosmetik organik"],
    varieties: ["125 gsm", "150 gsm", "200 gsm", "275 gsm", "350 gsm"],
    gallery: ["/A4_Brown_Krafting_Paper.jpg", "/box%20hampers%20kraft%20(1).webp", "/box%20hampers%20kraft%20(2).webp", "/corndog-kraft.webp"]
  }
];
