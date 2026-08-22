# Panduan Setup Kasir Icah Print

Ada 3 file yang sudah dibuat:

1. **icah-print-logo.svg** — logo toko
2. **kasir-icah-print.html** — aplikasi kasirnya (buka langsung di browser)
3. **Code.gs** — kode backend yang menghubungkan aplikasi ke Google Spreadsheet

Ikuti langkah berikut supaya data barang & transaksi tersimpan permanen di Google Spreadsheet.

## Langkah 1 — Buat Spreadsheet
1. Buka [sheets.google.com](https://sheets.google.com) → buat spreadsheet baru.
2. Beri nama, misalnya **"Database Kasir Icah Print"**.
3. Tidak perlu membuat sheet/kolom apa pun — aplikasi akan otomatis membuat tab `Produk`, `Transaksi`, dan `DetailTransaksi` saat pertama kali dipakai.

## Langkah 2 — Pasang Kode Backend (Apps Script)
1. Di spreadsheet, klik menu **Extensions/Ekstensi → Apps Script**.
2. Hapus semua kode default yang ada di editor.
3. Buka file **Code.gs** yang sudah dibuat, copy semua isinya, lalu paste ke editor Apps Script.
4. Klik ikon 💾 **Simpan**.

## Langkah 3 — Deploy sebagai Web App
1. Klik tombol **Deploy → New deployment** (Deploy Baru).
2. Klik ikon ⚙️ di sebelah "Select type", pilih **Web app**.
3. Isi:
   - **Execute as**: *Me (email Anda)*
   - **Who has access**: **Anyone** (harus "Anyone", bukan "Anyone with Google account", agar aplikasi kasir bisa mengaksesnya)
4. Klik **Deploy**.
5. Google akan meminta izin akses — klik **Authorize access**, pilih akun Google Anda, lalu klik **Advanced/Lanjutan → Go to (nama project) (unsafe)** → **Allow**. (Ini normal karena scriptnya milik Anda sendiri.)
6. Setelah berhasil, Anda akan mendapat **Web app URL** seperti:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
   Copy URL ini.

> **Catatan:** setiap kali Anda mengubah isi Code.gs di kemudian hari, Anda harus membuat **New deployment** lagi (bukan edit yang lama) agar perubahan aktif.

## Langkah 4 — Sambungkan ke Aplikasi Kasir
1. Buka **kasir-icah-print.html** di browser.
2. Masuk ke tab **Pengaturan**.
3. Tempel Web App URL tadi ke kolom **URL Web App Google Apps Script**.
4. Isi juga Nama Toko, Alamat/No. WA, dan Nama Kasir.
5. Klik **Simpan Pengaturan**, lalu klik **Tes Koneksi** untuk memastikan berhasil (akan muncul tanda ✓ hijau).

Setelah tersambung, titik status di pojok kanan atas aplikasi akan berubah menjadi **hijau — "Tersambung ke Spreadsheet"**, dan semua data barang serta transaksi otomatis tersimpan ke Google Sheets Anda.

## Cara Pakai Sehari-hari
- **Tab Kasir**: cari/klik barang untuk masuk keranjang, atur qty, pilih metode bayar, masukkan jumlah bayar (jika tunai), lalu klik **Buat Invoice & Bayar**. Nota otomatis muncul dan bisa langsung **Cetak**.
- **Tab Data Barang**: tambah, ubah, atau hapus barang/jasa cetak. Setiap perubahan otomatis tersinkron ke Spreadsheet.
- **Tab Riwayat**: melihat daftar transaksi yang tersimpan di Spreadsheet.
- **Tab Pengaturan**: ubah info toko atau URL Web App kapan saja.

## Cara Hosting Agar Bisa Dipakai di Toko Setiap Hari
File `kasir-icah-print.html` bisa langsung dibuka dari komputer/laptop kasir (klik dua kali), atau supaya lebih rapi:
- Upload ke **Google Drive** lalu buka lewat browser, atau
- Hosting gratis di **GitHub Pages** / **Netlify Drop** agar punya alamat web sendiri dan bisa diakses dari HP/tablet kasir juga.

## Jika "Tes Koneksi" Gagal
- Pastikan **Who has access** di deployment adalah **Anyone**, bukan "Only myself".
- Pastikan URL diakhiri `/exec`, bukan `/dev`.
- Coba buat **New deployment** baru jika sebelumnya sudah pernah deploy dengan pengaturan berbeda.
