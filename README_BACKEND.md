# Panduan Integrasi Frontend React ke Backend CodeIgniter 4 (CI4)

Aplikasi frontend ini dibangun menggunakan React + Vite. Berikut adalah langkah-langkah untuk menghubungkannya ke backend CI4 Anda di masa depan:

## 1. Konfigurasi API Base URL
Buat file `.env` di root folder frontend:
```env
VITE_API_URL=http://localhost:8080/api
```

## 2. Struktur API Service (Contoh Axios)
Ubah file `src/services/api.ts` untuk menggunakan Axios yang memanggil controller di CI4.

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Tambahkan JWT Token ke setiap request jika sudah login
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 3. Persiapan di Sisi CI4
- Aktifkan **CORS** di backend agar frontend bisa memanggil API. Update `app/Config/Filters.php`.
- Buat Controller yang mengembalikan format JSON.
- Contoh endpoint yang dibutuhkan:
  - `POST /api/auth/login`
  - `GET /api/mails/incoming`
  - `POST /api/mails/incoming`
  - `POST /api/dispositions`

## 4. Format Tanggal
Frontend menggunakan format ISO String atau `YYYY-MM-DD`. Pastikan database di CI4 (MySQL) mencocokkan format ini.

## 5. Upload File
Gunakan `FormData` di frontend saat mengirim file PDF ke CI4:
```typescript
const formData = new FormData();
formData.append('file', pdfFile);
formData.append('subject', subject);
await api.post('/mails/upload', formData);
```
