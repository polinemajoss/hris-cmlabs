# HRIS - Project Structure

Berikut adalah struktur direktori proyek HRIS 2025 yang terdiri dari dua bagian utama: **Backend** dan **Frontend**.

```
hris-cmlabs/
│
├── backend/                        # Backend API (Node.js + Express / Nest.js)
│   ├── src/
│   │   ├── controllers/            # Menangani HTTP request
│   │   ├── services/               # Logika bisnis
│   │   ├── repositories/           # Lapisan akses data (kueri DB)
│   │   ├── routes/                 # Definisi rute API
│   │   ├── models/                 # Model database (Sequelize / Mongoose)
│   │   ├── dto/                    # Data Transfer Object (request/response type)
│   │   ├── middleware/             # Auth, validasi, error handler
│   │   ├── config/                 # Koneksi DB, variabel lingkungan
│   │   ├── utils/                  # Fungsi bantu / helper
│   │   └── index.js                # Entry point server
│   └── package.json
│
├── frontend/                       # Aplikasi Frontend (Next.js)
│   ├── public/                     # Aset statis (gambar, font, dsb)
│   ├── src/
│   │   ├── app/                    # Halaman App Router (Next.js 13+)
│   │   │   ├── layout.jsx          # Root layout
│   │   │   ├── page.jsx            # Home / Dashboard
│   │   │   ├── auth/
│   │   │   │   ├── login/page.jsx
│   │   │   │   ├── register/page.jsx
│   │   │   │   ├── forgot-password/page.jsx
│   │   │   │   └── reset-password/page.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── admin/page.jsx
│   │   │   │   └── user/page.jsx
│   │   │   ├── payment-plan/
│   │   │   │   ├── page.jsx
│   │   │   │   └── components/
│   │   │   ├── employee-database/
│   │   │   │   ├── page.jsx
│   │   │   │   ├── add/page.jsx
│   │   │   │   └── components/
│   │   │   ├── checkclock/
│   │   │   │   ├── page.jsx
│   │   │   │   ├── details/page.jsx
│   │   │   │   └── components/
│   │   │   └── ...                 # Halaman tambahan lainnya
│   │   │
│   │   ├── components/             # Komponen UI yang bisa digunakan ulang
│   │   │   ├── layout/
│   │   │   ├── ui/
│   │   │   └── shared/
│   │   │
│   │   ├── hooks/                  # Custom React hooks
│   │   │
│   │   ├── lib/                    # Fungsi utilitas, API client
│   │   │
│   │   ├── styles/                 # File CSS global & konfigurasi Tailwind
│   │   │   ├── globals.css
│   │   │   └── theme.css
│   │   │
│   │   └── app.config.jsx          # Metadata aplikasi (title, description)
│   │
│   ├── next.config.js              # Konfigurasi Next.js
│   ├── tailwind.config.js          # Setup TailwindCSS
│   ├── postcss.config.js
│   └── package.json
├── docker-compose.yml              # Konfigurasi Docker untuk pengembangan
├── .env                            # File variabel lingkungan (Environment Variables)
├── README.md                       # Dokumentasi proyek (file ini)
└── package.json                    # Opsional - jika menggunakan monorepo
```

---

### 📌 Catatan

- Struktur ini memisahkan logika frontend dan backend dengan jelas untuk memudahkan pengelolaan.
- Folder `components/ui` di frontend mencakup komponen seperti button, input, card, dsb.
- Folder `employee-database/page.jsx` di frontend berfungsi sebagai halaman utama untuk manajemen data karyawan.
- File `docker-compose.yml` digunakan jika proyek dijalankan dengan container (Docker).

---

Untuk pertanyaan lebih lanjut atau setup lingkungan, silakan lihat dokumentasi tambahan di masing-masing folder (`backend/README.md` dan `frontend/README.md`).
