# Skill: 8-Prompt Vibecoding Workflow

---

## 1. Nama Skill
`vibecoding-8-prompt-workflow`

---

## 2. Deskripsi & Trigger

- **Fungsi**: Memandu pembangunan perangkat lunak berbasis AI secara profesional, terstruktur, bebas bug, dan bebas dari tampilan *AI slop*, mulai dari tahap konsepsi hingga *commit history* yang rapi.
- **Kapan Harus Digunakan**:
  - Saat pengguna ingin membangun aplikasi web atau fitur baru dari nol.
  - Saat pengguna mengucapkan kalimat seperti:
    - *"Pandu aku bikin aplikasi pakai 8 prompt framework"*
    - *"Bantu aku susun PRD dan Design Brief sebelum ngoding"*
    - *"Audit keamanan dan rapikan commit git proyek ini"*
- **Kapan TIDAK Boleh Digunakan**:
  - Pertanyaan teori umum yang tidak melibatkan pengerjaan proyek atau pembuatan *codebase*.

---

## 3. Instructions (Langkah Demi Langkah)

1. **Fase 1: Tulis PRD Lengkap (Role: Senior Product Manager)**
   - Sebelum menulis 1 baris kode pun, ajukan maksimal 5 pertanyaan klarifikasi mengenai target pengguna, batasan teknis, fitur MVP vs v2, dan *definition of done*.
   - Setelah pengguna menjawab, susun dokumen `PRD.md` (*Problem statement, Personas, Goals/Non-goals, User stories, Data model, Edge cases*).

2. **Fase 2: Full UI & UX Design Brief (Role: Senior Product Designer)**
   - Berdasarkan PRD, susun `DESIGN_BRIEF.md` (*Design principles, Visual direction, Design tokens, Screen layout, Component states, Responsive behavior*).
   - **Aturan UI**: Hindari *AI slop* (gradient ungu generik, *glow blur blobs*, teks marketing dengan ikon sparkles ✨). Utamakan antarmuka *Minimalist Developer Tool* (seperti Linear/Raycast).

3. **Fase 3: Inisialisasi & Eksekusi Kode**
   - Buat *codebase* berbasis **Next.js / React + TypeScript + Tailwind CSS** secara ramping (*lean architecture*).
   - Verifikasi kompilasi dengan `npm run build` untuk memastikan 0 error tipe TypeScript.

4. **Fase 4: Audit Keamanan Pra-Peluncuran (Role: Application Security Engineer)**
   - Lakukan audit celah keamanan (*Authentication, XSS, Input Sanitization, LocalStorage Schema, Secret Leaks*).
   - Sajikan laporan temuan berdasarkan *Severity* (Critical/High/Medium/Low).
   - **JEDA WAJIB**: Tunggu persetujuan pengguna sebelum melakukan perbaikan kode (*code fix*).

5. **Fase 5: Cleanup & Refactor Dead Code (Role: Senior Engineer)**
   - Audit dan hapus impor, variabel, atau dependensi yang tidak terpakai.

6. **Fase 6: Conventional Atomic Commits (Role: DevOps / Tech Lead)**
   - Inisialisasi Git dan kelompokkan perubahan menjadi *atomic commit* terpisah berstandar *Conventional Commits* (`docs(spec): ...`, `feat(core): ...`, `style(ui): ...`, `sec(storage): ...`).

---

## 4. Rules & Constraints

- **DILARANG** langsung menulis kode aplikasi sebelum PRD dan Design Brief disetujui.
- **DILARANG** mengubah kode aplikasi saat Security Audit sebelum mendapatkan *approval* eksplisit dari pengguna.
- **DILARANG** menggunakan ornamen UI *AI Slop* (background blur radius besar, ikon sparkles di banner header, glowing neon card border).
- **WAJIB** memverifikasi bahwa build (`npm run build`) lulus tanpa error sebelum melangkah ke commit.

---

## 5. Output Format Template

Setiap dokumen perencanaan wajib disimpan ke folder `docs/` proyek:
- `docs/PRD.md`
- `docs/DESIGN_BRIEF.md`
- `docs/SKILL.md`

---

## 6. Contoh Lengkap Pengerjaan

```text
User: "Aku mau bikin aplikasi Prompt Manager."
Agent (Role: Senior PM): "Siap! Sebelum menyusun PRD, aku punya 5 pertanyaan klarifikasi..."
User: [Menjawab 5 pertanyaan]
Agent: [Menghasilkan docs/PRD.md]
Agent (Role: Senior Designer): "Sekarang mari kita susun Design Brief..."
Agent: [Menghasilkan docs/DESIGN_BRIEF.md]
Agent: [Membangun codebase Next.js & memverifikasi npm run build]
Agent (Role: SecEng): "Berikut Laporan Security Audit..." -> [Tunggu Approval] -> [Apply Fix]
Agent (Role: Senior Engineer): [Git Atomic Commits]
```

---

## 7. Failure Mode & Cara Menghindarinya

1. **Failure Mode 1: AI Slop UI Syndrome**
   - *Sebab*: AI cenderung membuat tombol menyala-nyala dan banner ungu/pink dengan ikon sparkles.
   - *Pencegahan*: Patuhi aturan warna Slate/Zinc pekat, 1px border tipis, dan font monospace legibel.
2. **Failure Mode 2: Shotgun Refactoring & Silent Code Mutating**
   - *Sebab*: AI langsung mengubah kode tanpa mengonfirmasi akar masalah.
   - *Pencegahan*: Wajibkan jeda (*Human-in-the-Loop*) di setiap fase audit.
3. **Failure Mode 3: Monolithic Git Commit**
   - *Sebab*: Menyatukan seluruh perubahan ribuan baris dalam 1 commit `"initial commit"`.
   - *Pencegahan*: Pecah perubahan menjadi 3-4 commit atomic sesuai *intent* (`docs`, `feat`, `style`, `sec`).
