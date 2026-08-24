function generatePreview(event) {
    event.preventDefault();

    // 1. Ambil Nilai dari Form Input
    const namaPelanggan = document.getElementById('namaPelanggan').value;
    const noLayanan = document.getElementById('noLayanan').value;
    const tipeIdentitas = document.getElementById('tipeIdentitas').value;
    const nikPelanggan = document.getElementById('nikPelanggan').value;
    const alamatPelanggan = document.getElementById('alamatPelanggan').value;

    const keterangan = document.getElementById('keteranganBerhenti').value || '-';
    const tagihan = document.getElementById('informasiTagihan').value || '-';

    const namaTelkom = document.getElementById('namaTelkom').value || 'Yustika Monita';

    const namaKuasa = document.getElementById('namaKuasa').value;
    const nikKuasa = document.getElementById('nikKuasa').value;
    const tipeIdentitasKuasa = document.getElementById('tipeIdentitasKuasa').value;
    const alamatKuasa = document.getElementById('alamatKuasa').value;

    // 2. Bagian Atas ("Yang bertanda tangan di bawah ini") -> Data PELANGGAN
    document.getElementById('prevYangBertandaTanganNama').innerText = namaPelanggan;
    document.getElementById('prevYangBertandaTanganAlamat').innerText = alamatPelanggan;
    document.getElementById('prevYangBertandaTanganTipe').innerText = tipeIdentitas;
    document.getElementById('prevYangBertandaTanganNik').innerText = nikPelanggan;

    // 3. Bagian Bawah ("Bertindak untuk dan atas nama") -> Data PENERIMA KUASA
    if (namaKuasa && namaKuasa.trim() !== '') {
        document.getElementById('prevAtasNamaPelangganNama').innerText = namaKuasa;
        document.getElementById('prevAtasNamaPelangganAlamat').innerText = alamatKuasa;
        document.getElementById('prevAtasNamaPelangganTipe').innerText = tipeIdentitasKuasa;
        document.getElementById('prevAtasNamaPelangganNik').innerText = nikKuasa;
    } else {
        document.getElementById('prevAtasNamaPelangganNama').innerText = '-';
        document.getElementById('prevAtasNamaPelangganAlamat').innerText = '-';
        document.getElementById('prevAtasNamaPelangganTipe').innerText = '-';
        document.getElementById('prevAtasNamaPelangganNik').innerText = '-';
    }

    // 4. Data Layanan
    document.getElementById('prevNoLayanan').innerText = noLayanan;
    document.getElementById('prevAtasNamaLayanan').innerText = namaPelanggan;
    document.getElementById('prevAlamatLayanan').innerText = alamatPelanggan;

    // 5. Detail Berhenti Berlangganan
    document.getElementById('prevKeterangan').innerText = keterangan;
    document.getElementById('prevTagihan').innerText = tagihan;

    // 6. Tanda Tangan
    document.getElementById('prevSignPenanggungJawab').innerText = namaTelkom;
    document.getElementById('prevSignPelanggan').innerText = namaPelanggan;

    // 7. Realtime Date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    document.getElementById('prevRealtimeDate').innerText = `Banyuwangi, ${formattedDate}`;

    // 8. Tampilkan Preview
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
        pdf.save(`Surat_DO_${namaPelanggan.replace(/\s+/g, '_')}.pdf`);

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