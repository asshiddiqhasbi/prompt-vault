# PromptVault ⚡

> **Modern, Minimalist AI Prompt & Workflow Manager for Developers**

PromptVault adalah aplikasi web modern, ringan, dan cepat yang dirancang khusus untuk mengelola, kustomisasi variabel dinamis `{{variabel}}`, dan menyalin template prompt AI berkualitas dalam 1-klik. Ditujukan bagi para developer, designer, dan prompter yang menginginkan efisiensi maksimal tanpa *AI slop visual*.

![PromptVault Theme](https://img.shields.io/badge/Theme-Zinc%20Dark%20Minimalist-09090b?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06b6d4?style=flat-square&logo=tailwindcss)

---

## ✨ Fitur Unggulan (v2.0)

- ⚡ **Dynamic Variable Substitution (`{{VAR}}`)**: Otomatis mendeteksi variabel dalam prompt dan menampilkan form pop-up untuk pengisian nilai dinamis sebelum disalin.
- 📋 **One-Click Clipboard Copy**: Salin hasil prompt yang sudah terisi variabel dalam 1 kali klik.
- 📄 **Export to `SKILL.md` (Integrasi Prompt 8)**: Ekspor prompt favorit kamu menjadi file markdown `SKILL.md` berstandar Antigravity AI Agent.
- 🔗 **Shareable Prompt via Encoded URL**: Bagikan prompt spesifik ke teman atau komunitas melalui link URL aman tanpa perlu backend server.
- 📊 **Usage Analytics & Sorting**: Melacak frekuensi penyalinan prompt (`12x dipakai`) dan stempel waktu penggunaan terakhir. Filter berdasarkan *Terbaru*, *Paling Sering Dipakai*, *Terakhir Dipakai*, dan *Abjad A-Z*.
- 🖤 **Minimalist Developer UI (Zero AI Slop)**: Mengusung tema *Dark Mode Slate/Zinc* presisi ala Linear & Raycast tanpa blur gradient berlebihan.
- 💾 **Local Backup & Restore**: Ekspor & impor seluruh data koleksi prompt kamu dalam format `.json`.

---

## 📚 Seed Prompts Framework Bawaan

Aplikasi ini dilengkapi 8 Prompt Framework profesional bawaan (*inspiration by @haloziq*):

1. **1/ Tulis PRD Lengkap** (Product Manager)
2. **2/ Full UI & UX Design Brief** (UI/UX Designer)
3. **3/ Temukan Celah Keamanan** (Security Engineer)
4. **4/ Debug Error dengan Cepat** (Engineering)
5. **5/ E2E Test Aplikasimu (Playwright)** (Testing)
6. **6/ Bersihkan & Refactor Dead Code** (Engineering)
7. **7/ Tulis Git Commit yang Rapi** (DevOps / Git)
8. **8/ Ubah Task Jadi Skill** (Skill Automation)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (Zinc Dark Palette)
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage & IndexedDB (Client-side first, zero database latency)

---

## 🚀 Cara Menjalankan di Lokal

### Prasyarat
- Node.js v18.0.0 atau lebih baru
- npm / yarn / pnpm

### Langkah Instalasi

1. Clone repositori ini:
   ```bash
   git clone https://github.com/USERNAME/promptvault.git
   cd promptvault
   ```

2. Install dependensi:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```

4. Buka **`http://localhost:3000`** di browser kamu.

---

## 📖 Dokumentasi Perencanaan

Dokumen spesifikasi proyek terstruktur tersimpan di folder `docs/`:
- 📄 [PRD.md](docs/PRD.md) - Product Requirement Document v1.0
- 🎨 [DESIGN_BRIEF.md](docs/DESIGN_BRIEF.md) - Full UI & UX Design Brief
- 🧠 [SKILL.md](docs/SKILL.md) - 8-Prompt Vibecoding Workflow Skill Specification

---

## 📄 Lisensi

Proyek ini terlisensi di bawah [MIT License](LICENSE).
