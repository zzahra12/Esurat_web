function generatePreview(event) {
    event.preventDefault();

    // 1. Ambil Nilai dari Form Input
    const namaPelanggan = document.getElementById('namaPelanggan').value;
    const noLayanan = document.getElementById('noLayanan').value;
    const tipeIdentitas = document.getElementById('tipeIdentitas').value;
    const nikPelanggan = document.getElementById('nikPelanggan').value;

    const alamatLama = document.getElementById('alamatLama').value;
    const alamatBaru = document.getElementById('alamatBaru').value;
    const noTelpLama = document.getElementById('noTelpLama').value || '-';
    const noTelpBaru = document.getElementById('noTelpBaru').value || '-';
    const noInternetLama = document.getElementById('noInternetLama').value || '-';
    const noInternetBaru = document.getElementById('noInternetBaru').value || '-';
    const keterangan = document.getElementById('keteranganTambahan').value || '-';

    const namaTelkom = document.getElementById('namaTelkom').value || 'Yustika Monita';

    const namaKuasa = document.getElementById('namaKuasa').value;
    const nikKuasa = document.getElementById('nikKuasa').value;
    const tipeIdentitasKuasa = document.getElementById('tipeIdentitasKuasa').value;
    const alamatKuasa = document.getElementById('alamatKuasa').value;

    // 2. Logika Kuasa (Jika Penerima Kuasa Diisi)
    const containerKuasa = document.getElementById('containerPrevKuasa');

    if (namaKuasa && namaKuasa.trim() !== '') {
        // Tampilkan tabel "Bertindak untuk dan atas nama:" jika ada Kuasa
        if (containerKuasa) containerKuasa.style.display = 'block';

        // Pihak 1 (Atas): Penerima Kuasa
        document.getElementById('prevYangBertandaTanganNama').innerText = namaKuasa;
        document.getElementById('prevYangBertandaTanganAlamat').innerText = alamatKuasa;
        document.getElementById('prevYangBertandaTanganTipe').innerText = tipeIdentitasKuasa;
        document.getElementById('prevYangBertandaTanganNik').innerText = nikKuasa;

        // Pihak 2 (Tengah): Pelanggan Utama Pemilik Layanan
        document.getElementById('prevAtasNamaPelangganNama').innerText = namaPelanggan;
        document.getElementById('prevAtasNamaPelangganAlamat').innerText = alamatLama;
        document.getElementById('prevAtasNamaPelangganTipe').innerText = tipeIdentitas;
        document.getElementById('prevAtasNamaPelangganNik').innerText = nikPelanggan;
    } else {
        // Sembunyikan tabel "Bertindak untuk dan atas nama:" jika tidak ada Kuasa
        if (containerKuasa) containerKuasa.style.display = 'none';

        // Pihak 1 (Atas): Pelanggan Utama Langsung
        document.getElementById('prevYangBertandaTanganNama').innerText = namaPelanggan;
        document.getElementById('prevYangBertandaTanganAlamat').innerText = alamatLama;
        document.getElementById('prevYangBertandaTanganTipe').innerText = tipeIdentitas;
        document.getElementById('prevYangBertandaTanganNik').innerText = nikPelanggan;
    }

    // 3. Data Layanan
    document.getElementById('prevNoLayanan').innerText = noLayanan;
    document.getElementById('prevAtasNamaLayanan').innerText = namaPelanggan;
    document.getElementById('prevAlamatLayanan').innerText = alamatLama;

    // 4. Detail Pindah Alamat / PDA
    document.getElementById('prevAlamatLama').innerText = alamatLama;
    document.getElementById('prevAlamatBaru').innerText = alamatBaru;
    document.getElementById('prevNoTelpLama').innerText = noTelpLama;
    document.getElementById('prevNoTelpBaru').innerText = noTelpBaru;
    document.getElementById('prevNoInternetLama').innerText = noInternetLama;
    document.getElementById('prevNoInternetBaru').innerText = noInternetBaru;
    document.getElementById('prevKeterangan').innerText = keterangan;

    // 5. Tanda Tangan
    document.getElementById('prevSignPenanggungJawab').innerText = namaTelkom;
    document.getElementById('prevSignPelanggan').innerText = namaPelanggan;

    // 6. Realtime Date (Banyuwangi)
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    document.getElementById('prevRealtimeDate').innerText = `Banyuwangi, ${formattedDate}`;

    // 7. Tampilkan Preview & Aktifkan Tombol Unduh PDF
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('letterPaper').style.display = 'block';

    document.getElementById('btnDownload').disabled = false;
}

// Unduh PDF Presisi A4
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById('letterPaper');
    const namaPelanggan = document.getElementById('namaPelanggan').value || 'Pelanggan';

    const originalTransform = element.style.transform;
    const originalMaxHeight = element.style.maxHeight;
    const originalOverflow = element.style.overflow;

    element.style.transform = 'scale(1)';
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            scrollY: -window.scrollY
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        
        const marginX = 12;
        const marginY = 12;
        const printWidth = pdfWidth - (marginX * 2);
        const printHeight = (canvas.height * printWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', marginX, marginY, printWidth, printHeight);
        pdf.save(`Surat_PDA_${namaPelanggan.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
        console.error("Gagal mengunduh PDF:", error);
        alert("Terjadi kesalahan saat memproses file PDF.");
    } finally {
        element.style.transform = originalTransform;
        element.style.maxHeight = originalMaxHeight;
        element.style.overflow = originalOverflow;
    }
}

// Control Zoom & Fullscreen
let currentScale = 1;

function zoomIn() {
    if (currentScale < 1.5) {
        currentScale += 0.1;
        applyZoom();
    }
}

function zoomOut() {
    if (currentScale > 1.0) {
        currentScale -= 0.1;
        applyZoom();
    }
}

function applyZoom() {
    const paper = document.getElementById('letterPaper');
    if (paper) {
        paper.style.transform = `scale(${currentScale})`;
        paper.style.transformOrigin = 'top center';
        paper.style.transition = 'transform 0.2s ease';
    }
}

function toggleFullscreen() {
    const previewCard = document.querySelector('.card-preview');
    if (previewCard) {
        previewCard.classList.toggle('fullscreen-mode');
    }
}