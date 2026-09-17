import { Category, PromptItem } from "@/types/prompt";

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "all",
    name: "Semua",
    slug: "all",
    isDefault: true,
    color: { bg: "bg-zinc-800", text: "text-zinc-200", border: "border-zinc-700" }
  },
  {
    id: "writing",
    name: "Writing & Copywriting",
    slug: "writing",
    isDefault: true,
    description: "Script video, artikel, email, caption, dan penulisan kreatif",
    color: { bg: "bg-zinc-900", text: "text-purple-300", border: "border-purple-800/40" }
  },
  {
    id: "business",
    name: "Business & Marketing",
    slug: "business",
    isDefault: true,
    description: "Copy iklan, strategi jualan, pitch deck, dan ide bisnis",
    color: { bg: "bg-zinc-900", text: "text-blue-300", border: "border-blue-800/40" }
  },
  {
    id: "education",
    name: "Education & Study",
    slug: "education",
    isDefault: true,
    description: "Rangkum jurnal/artikel, penjelas konsep, dan latihan soal",
    color: { bg: "bg-zinc-900", text: "text-emerald-300", border: "border-emerald-800/40" }
  },
  {
    id: "creative",
    name: "Creativity & Visual AI",
    slug: "creative",
    isDefault: true,
    description: "Prompt gambar Midjourney/DALL-E, ide konten, dan visual",
    color: { bg: "bg-zinc-900", text: "text-rose-300", border: "border-rose-800/40" }
  },
  {
    id: "productivity",
    name: "Productivity & Daily",
    slug: "productivity",
    isDefault: true,
    description: "Perencanaan harian, balasan chat/email, dan habit tracker",
    color: { bg: "bg-zinc-900", text: "text-amber-300", border: "border-amber-800/40" }
  },
  {
    id: "tech",
    name: "Tech & Engineering",
    slug: "tech",
    isDefault: true,
    description: "Debugging error, koding, PRD produk, dan arsitektur tech",
    color: { bg: "bg-zinc-900", text: "text-cyan-300", border: "border-cyan-800/40" }
  }
];

export const SEED_PROMPTS: PromptItem[] = [
  {
    id: "prompt-1-script-viral",
    title: "Script Video Shorts / TikTok / Reels",
    description: "Bikin script video pendek dengan Hook memikat, isi padat, dan Call-to-Action dalam 60 detik.",
    content: `Kamu adalah ahli pembuat konten video pendek (TikTok/Reels/Shorts). Buatkan script video berdurasi 30-60 detik tentang topik berikut.

Topik Video: {{TOPIK_VIDEO}}
Target Penonton: {{TARGET_AUDIENS}}
Tujuan Video: {{TUJUAN_VIDEO}}

Format Script:
1. Hook (3 Detik Pertama): Kalimat penarik perhatian yang bikin orang berhenti scrolling.
2. Problem / Context (10 Detik): Masalah nyata yang dirasakan penonton.
3. Solution & Main Value (30 Detik): 3 poin solusi konkret atau tips utama yang mudah dipahami.
4. Call to Action (CTA - 7 Detik): Panggilan bertindak (misal: "Follow untuk tips berikutnya", "Komen pendapatmu", "Cek link di bio").

Gunakan gaya bahasa yang santai, komunikatif, dan menarik tanpa bertele-tele.`,
    categoryId: "writing",
    tags: ["#tiktok", "#reels", "#scriptwriter", "#content-creator"],
    isFavorite: true,
    copyCount: 0,
    createdAt: "2026-09-17T00:00:00.000Z",
    updatedAt: "2026-09-17T00:00:00.000Z"
  },
  {
    id: "prompt-2-rangkum-jurnal",
    title: "Rangkum Artikel / Jurnal Panjang",
    description: "Mengubah artikel ilmiah, bacaan panjang, atau berita menjadi poin ringkas yang mudah dipahami.",
    content: `Berperanlah sebagai asisten akademis. Rangkum teks/bacaan berikut agar saya bisa memahaminya dalam waktu 2 menit.

Teks / Artikel yang Akan Dirangkum:
{{TEKS_ARTIKEL}}

Hasilkan rangkuman dengan struktur berikut:
1. Ringkasan Utama (1 Kalimat Inti): Apa pesan terbesar dari teks ini?
2. 5 Poin Kunci Utama (Bullet Points): Penjelasan terpenting beserta data/fakta pentingnya.
3. Kesimpulan & Implikasi: Apa dampak atau pelajaran utama dari isi bacaan ini?
4. Glosarium Singkat: Jelaskan 2-3 istilah sulit (jika ada) menggunakan bahasa awam.

Gunakan bahasa Indonesia yang jelas, bernomor, dan objektif.`,
    categoryId: "education",
    tags: ["#rangkuman", "#jurnal", "#mahasiswa", "#membaca"],
    isFavorite: true,
    copyCount: 0,
    createdAt: "2026-09-17T00:00:00.000Z",
    updatedAt: "2026-09-17T00:00:00.000Z"
  },
  {
    id: "prompt-3-email-profesional",
    title: "Draft Balasan Email Profesional",
    description: "Menyusun draft email bisnis, permohonan, izin, atau balasan kerja yang elegan dan tegas.",
    content: `Kamu adalah spesialis komunikasi bisnis profesional. Tuliskan draft email yang sopan, jelas, dan efektif.

Maksud / Tujuan Email: {{TUJUAN_EMAIL}}
Penerima Email: {{PENERIMA_EMAIL}}
Pesan Utama yang Ingin Disampaikan: {{PESAN_UTAMA}}
Nada / Tone Bicara: {{TONE_BICARA}}

Hasilkan:
1. Subjek Email: 2 pilihan subjek yang jelas dan profesional.
2. Isi Email:
   - Salam pembuka yang sesuai.
   - Paragraf pertama (latar belakang / maksud utama).
   - Paragraf kedua (rincian poin atau tindakan yang diharapkan).
   - Penutup yang sopan dan salam hormat.

Tulis dalam format yang siap di-copy dan dikirim.`,
    categoryId: "productivity",
    tags: ["#email", "#karir", "#komunikasi", "#bisnis"],
    isFavorite: true,
    copyCount: 0,
    createdAt: "2026-09-17T00:00:00.000Z",
    updatedAt: "2026-09-17T00:00:00.000Z"
  },
  {
    id: "prompt-4-copy-jualan",
    title: "Copywriting Caption & Iklan Jualan",
    description: "Membuat caption promosi jualan produk/jasa yang menghipnotis pembeli menggunakan formula AIDA.",
    content: `Kamu adalah ahli copywriter jualan online. Buatkan caption jualan berdaya konversi tinggi untuk produk berikut.

Nama Produk / Jasa: {{NAMA_PRODUK}}
Manfaat Utama Produk: {{MANFAAT_PRODUK}}
Harga / Penawaran Spesial: {{PENAWARAN_HARGA}}
Target Pembeli: {{TARGET_PEMBELI}}

Gunakan Formula AIDA (Attention, Interest, Desire, Action):
- Attention (Headline): Judul unik yang memicu rasa penasaran pembeli.
- Interest: Kaitkan masalah calon pembeli dengan alasan mereka butuh produk ini.
- Desire: Jelaskan keunggulan dan penawaran hemat/bonus spesial.
- Action (CTA): Panggilan membeli (misal: "Klik link di bio sebelum kehabisan!").

Sertakan 5-8 hashtag populer yang relevan untuk jualan di Instagram/TikTok.`,
    categoryId: "business",
    tags: ["#copywriting", "#jualan", "#instagram", "#marketing"],
    isFavorite: false,
    copyCount: 0,
    createdAt: "2026-09-17T00:00:00.000Z",
    updatedAt: "2026-09-17T00:00:00.000Z"
  },
  {
    id: "prompt-5-midjourney-prompt",
    title: "Prompt Midjourney / DALL-E Photo Realistis",
    description: "Membuat prompt AI Image generator lengkap dengan spesifikasi kamera, lighting, dan style.",
    content: `Kamu adalah pakar prompt engineer AI Image (Midjourney v6 / DALL-E 3). Buatkan prompt gambar dalam bahasa Inggris yang detail dan menakjubkan.

Subjek Gambar: {{SUBJEK_GAMBAR}}
Suasana / Mood: {{MOOD_GAMBAR}}
Gaya Visual: {{GAYA_VISUAL}}

Hasilkan:
1. Prompt Utama (Bahasa Inggris): Sertakan deskripsi subjek, lighting (misal: cinematic lighting, golden hour), lensa kamera (misal: 85mm lens, f/1.8), render detail (8k resolution, photorealistic, Unreal Engine 5 render), dan aspek rasio (--ar 16:9 atau --ar 4:5).
2. Negative Prompt (Bahasa Inggris): Elemen yang harus dihindari (misal: blurry, deformed hands, low quality).
3. Penjelasan Singkat (Bahasa Indonesia): Apa efek visual yang akan dihasilkan prompt ini.`,
    categoryId: "creative",
    tags: ["#midjourney", "#dalle", "#ai-image", "#prompt-art"],
    isFavorite: false,
    copyCount: 0,
    createdAt: "2026-09-17T00:00:00.000Z",
    updatedAt: "2026-09-17T00:00:00.000Z"
  },
  {
    id: "prompt-6-feynman-method",
    title: "Penjelas Konsep Rumit (Metode Feynman)",
    description: "Jelaskan konsep akademik, sains, bisnis, atau teknologi seolah-olah mengajar anak usia 10 tahun.",
    content: `Berperanlah sebagai komunikator sains dan edukator jenius. Jelaskan konsep berikut menggunakan Metode Feynman.

Konsep / Topik yang Ingin Dipahami: {{TOPIK_RUMIT}}

Gunakan aturan berikut:
1. Jelaskan topik ini seolah-olah kamu sedang mengajar anak usia 10 tahun.
2. Gunakan analogi atau perumpamaan dunia nyata yang sangat akrab di kehidupan sehari-hari.
3. Hindari kata-kata jargon ilmiah. Jika terpaksa menggunakan istilah teknis, jelaskan maksudnya secara langsung.
4. Buat dalam 3 paragraf singkat yang runtut dan menarik.
5. Akhiri dengan 1 contoh kasus sederhana yang bisa dicoba/dibayangkan penonton.`,
    categoryId: "education",
    tags: ["#feynman", "#belajar", "#edukasi", "#penjelasan"],
    isFavorite: false,
    copyCount: 0,
    createdAt: "2026-09-17T00:00:00.000Z",
    updatedAt: "2026-09-17T00:00:00.000Z"
  },
  {
    id: "prompt-7-ide-bisnis",
    title: "Perencana Strategi Bisnis & Ide Konten",
    description: "Merancang strategi eksekusi bisnis baru, analisis kompetitor, dan ide promosi awal.",
    content: `Kamu adalah konsultan bisnis startup dan strategi pemasaran. Berikan analisis dan rencana eksekusi bisnis berikut.

Ide Bisnis / Jasa: {{IDE_BISNIS}}
Modal / Sumber Daya Awal: {{MODAL_AWAL}}
Target Pasar Utama: {{TARGET_PASAR}}

Buatkan rencana strategi ringkas:
1. Unique Selling Proposition (USP): Apa yang membuat bisnis ini beda dari kompetitor?
2. 3 Saluran Pemasaran Tercepat: Bagaimana cara mendapatkan 100 pelanggan pertama?
3. Strategi Konten Organik: 5 ide konten promosi awal yang murah tetapi efektif.
4. Potensi Risiko & Solusi: 2 hambatan terbesar dan cara mengantisipasinya.`,
    categoryId: "business",
    tags: ["#bisnis", "#startup", "#strategi", "#ide-usaha"],
    isFavorite: false,
    copyCount: 0,
    createdAt: "2026-09-17T00:00:00.000Z",
    updatedAt: "2026-09-17T00:00:00.000Z"
  },
  {
    id: "prompt-8-prd-tech",
    title: "Tulis PRD & Spek Produk (Product Spec)",
    description: "Menyusun Product Requirement Document lengkap untuk pengembangan fitur aplikasi.",
    content: `Kamu adalah senior product manager. Saya butuh PRD lengkap untuk produk berikut:

Ide Produk / Fitur: {{IDE_PRODUK}}

Sebelum menulis apa pun, tanyakan maksimal 5 pertanyaan klarifikasi soal target user, scope must-have vs nice-to-have, dan batasan teknis. Tunggu jawaban saya.

Lalu buat PRD dengan bagian berikut:
1. Problem statement & target user personas
2. Goals dan non-goals
3. User stories ("Sebagai... saya ingin... supaya...")
4. Fitur MVP vs v2
5. Functional requirement detail
6. Data model & Edge cases`,
    categoryId: "tech",
    tags: ["#prd", "#product-manager", "#tech", "#aplikasi"],
    isFavorite: false,
    copyCount: 0,
    createdAt: "2026-09-17T00:00:00.000Z",
    updatedAt: "2026-09-17T00:00:00.000Z"
  }
];
