function generatePreview(event) {
    event.preventDefault();

    try {
        // 1. Data Pelanggan Utama
        const namaPelanggan = document.getElementById('namaPelanggan')?.value || '-';
        const noLayanan = document.getElementById('noLayanan')?.value || '-';
        const tipeIdentitas = document.getElementById('tipeIdentitas')?.value || '-';
        const nikPelanggan = document.getElementById('nikPelanggan')?.value || '-';
        const alamatPelanggan = document.getElementById('alamatPelanggan')?.value || '-';

        // 2. Data Kuasa (Opsional) - Fallback '-' jika kosong
        const namaKuasaInput = document.getElementById('namaKuasa')?.value;
        const nikKuasaInput = document.getElementById('nikKuasa')?.value;
        const tipeIdentitasKuasaInput = document.getElementById('tipeIdentitasKuasa')?.value;
        const alamatKuasaInput = document.getElementById('alamatKuasa')?.value;

        const namaKuasa = (namaKuasaInput && namaKuasaInput.trim() !== '') ? namaKuasaInput.trim() : '-';
        const nikKuasa = (nikKuasaInput && nikKuasaInput.trim() !== '') ? nikKuasaInput.trim() : '-';
        const tipeIdentitasKuasa = (tipeIdentitasKuasaInput && tipeIdentitasKuasaInput.trim() !== '') ? tipeIdentitasKuasaInput.trim() : '-';
        const alamatKuasa = (alamatKuasaInput && alamatKuasaInput.trim() !== '') ? alamatKuasaInput.trim() : '-';

        // 3. Data Tambahan & TTD Monita
        const keteranganInput = document.getElementById('keteranganTambahan')?.value;
        const keterangan = (keteranganInput && keteranganInput.trim() !== '') ? keteranganInput.trim() : '-';
        const namaTelkom = document.getElementById('namaTelkom')?.value || 'Yustika Monita';
        const isTtdMonitaChecked = document.getElementById('checkTtdMonita')?.checked;

        // Toggle Gambar TTD Monita
        const imgTtd = document.getElementById('imgTtdMonita');
        if (imgTtd) {
            imgTtd.style.display = isTtdMonitaChecked ? 'block' : 'none';
        }

        // --- MENGISI PREVIEW SURAT ---

        // PIHAK ATAS: Yang bertanda tangan di bawah ini = SELALU PELANGGAN UTAMA
        if (document.getElementById('prevPelangganNama')) document.getElementById('prevPelangganNama').innerText = namaPelanggan;
        if (document.getElementById('prevPelangganAlamat')) document.getElementById('prevPelangganAlamat').innerText = alamatPelanggan;
        if (document.getElementById('prevPelangganTipe')) document.getElementById('prevPelangganTipe').innerText = tipeIdentitas;
        if (document.getElementById('prevPelangganNik')) document.getElementById('prevPelangganNik').innerText = nikPelanggan;

        // PIHAK TENGAH: Bertindak untuk dan atas nama = SELALU PENERIMA KUASA (Tampil '-' jika kosong)
        if (document.getElementById('prevKuasaNama')) document.getElementById('prevKuasaNama').innerText = namaKuasa;
        if (document.getElementById('prevKuasaAlamat')) document.getElementById('prevKuasaAlamat').innerText = alamatKuasa;
        if (document.getElementById('prevKuasaTipe')) document.getElementById('prevKuasaTipe').innerText = tipeIdentitasKuasa;
        if (document.getElementById('prevKuasaNik')) document.getElementById('prevKuasaNik').innerText = nikKuasa;

        // TANDA TANGAN: SELALU PAKAI NAMA PELANGGAN UTAMA
        if (document.getElementById('prevSignPelanggan')) {
            document.getElementById('prevSignPelanggan').innerText = namaPelanggan;
        }

        // Detail Layanan & Penanggung Jawab
        if (document.getElementById('prevNoLayanan')) document.getElementById('prevNoLayanan').innerText = noLayanan;
        if (document.getElementById('prevAtasNamaLayanan')) document.getElementById('prevAtasNamaLayanan').innerText = namaPelanggan;
        if (document.getElementById('prevAlamatLayanan')) document.getElementById('prevAlamatLayanan').innerText = alamatPelanggan;
        if (document.getElementById('prevKeterangan')) document.getElementById('prevKeterangan').innerText = keterangan;
        if (document.getElementById('prevSignPenanggungJawab')) document.getElementById('prevSignPenanggungJawab').innerText = namaTelkom;

        // Tanggal Realtime
        const today = new Date();
        if (document.getElementById('prevRealtimeDate')) {
            document.getElementById('prevRealtimeDate').innerText = `Banyuwangi, ${today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        }

        // Tampilkan Preview & Aktifkan Download
        const emptyState = document.getElementById('emptyState');
        const letterPaper = document.getElementById('letterPaper');
        const btnDownload = document.getElementById('btnDownload');

        if (emptyState) emptyState.style.display = 'none';
        if (letterPaper) letterPaper.style.display = 'block';
        if (btnDownload) btnDownload.disabled = false;

    } catch (error) {
        console.error("Error preview:", error);
        alert("Terjadi kesalahan saat membuat preview.");
    }
}