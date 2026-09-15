# Product Requirement Document (PRD) v1.0
## Proyek: PromptVault (AI Workflow & Prompt Manager)

---

### 1. Problem Statement
Developer, designer, dan pengguna AI sering menyimpan prompt-prompt berkualitas (*high-performing prompts*) di tempat terpisah (seperti Notion, WhatsApp, file TXT, atau *chat history*). Hal ini menyebabkan:
- **Lambat & Kurang Efisien**: Harus mencari manual dan mengedit variabel prompt secara manual setiap kali ingin menggunakannya.
- **Risiko Kehilangan Data**: Tidak ada sistem pencadangan yang terpusat dan terstruktur.
- **Tampilan Kurang Terorganisir**: Mengalami kesulitan dalam memfilter prompt berdasarkan topik (*debugging*, *PRD*, *security*, *design*).

---

### 2. Target User & Persona

- **Persona 1: Hasbi (The Power Vibecoder / Solo Dev)**
  - *Kebutuhan*: Menyimpan dan memakai ulang template prompt profesional (*PRD generator*, *bug debugger*, *refactoring*) secara cepat dengan pengisian variabel dinamis.
  - *Goal*: Hemat waktu saat berinteraksi dengan AI Agent / LLM.

- **Persona 2: Rian (The Tech Content Enthusiast)**
  - *Kebutuhan*: Mengumpulkan prompt-prompt bermanfaat dari internet/sosial media dan membagikannya atau memindahkannya antar perangkat.
  - *Goal*: Punya koleksi prompt yang terorganisir dan dapat di-export/import dengan mudah.

---

### 3. Goals & Non-Goals

#### Goals (Tujuan Proyek)
- Membangun aplikasi web modern, ringan, dan responsif menggunakan **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, dan **Shadcn UI**.
- Menyediakan manajemen prompt yang fleksibel: *Create*, *Read*, *Update*, *Delete* (CRUD).
- Menyediakan fitur **Dynamic Variable Replacement** untuk pengisian nilai variabel prompt secara otomatis sebelum disalin.
- Menyediakan sistem pengelompokan ganda (Kategori + Multi-Tag) dan *real-time search*.
- Menyediakan pencadangan lokal yang aman via **Export & Import JSON**.

#### Non-Goals (Bukan Fokus MVP v1)
- Autentikasi pengguna berbasis server / cloud database (saat ini murni *client-side storage*).
- Fitur kolaborasi *multi-user real-time*.
- Integrasi pembayaran (Micro-SaaS billing).

---

### 4. User Stories

1. *Sebagai developer*, saya ingin menyimpan prompt beserta variabel dinamis (contoh: `{{NAMA_APLIKASI}}`) supaya saya bisa mengisi variabel tersebut melalui form popup tanpa perlu mengedit teks manual.
2. *Sebagai pengguna*, saya ingin menyalin prompt yang sudah terisi variabel hanya dengan **1 klik tombol copy** agar langsung siap ditempel ke ChatGPT/Gemini/Antigravity.
3. *Sebagai pengguna*, saya ingin mengelompokkan prompt berdasarkan Kategori dan Tag agar mudah memfilter prompt saat sedang fokus ngoding.
4. *Sebagai pengguna*, saya ingin mengekspor seluruh data prompt saya menjadi file `.json` agar data saya aman dari risiko terhapusnya cache browser.
5. *Sebagai pengguna*, saya ingin mengimpor file backup `.json` ke browser lain agar koleksi prompt saya langsung pulih seketika.

---

### 5. Daftar Fitur (Feature Breakdown)

| Fitur | Prioritas | Keterangan |
| :--- | :--- | :--- |
| **Prompt CRUD** | MVP (v1) | Tambah, edit, hapus, dan lihat detail prompt |
| **Dynamic Variable Substitution** | MVP (v1) | Deteksi `{{var}}` dan tampilkan modal form pengisian sebelum copy |
| **One-Click Clipboard Copy** | MVP (v1) | Tombol cepat copy dengan feedback toast notifikasi |
| **Category & Multi-Tagging** | MVP (v1) | Pengelompokan visual dengan badge warna & filter |
| **Real-time Search & Filter** | MVP (v1) | Pencarian instant berdasarkan judul, isi, tag, atau kategori |
| **Favorite / Starred Prompt** | MVP (v1) | Pin prompt penting ke bagian paling atas |
| **JSON Export & Import** | MVP (v1) | Backup & restore data lokal |
| **Dark Mode & Modern UI** | MVP (v1) | Tampilan bersih berbasis Shadcn UI |

---

### 6. Data Model

```typescript
interface PromptItem {
  id: string;
  title: string;
  description?: string;
  content: string;
  categoryId: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  colorBadge?: string;
}
```
