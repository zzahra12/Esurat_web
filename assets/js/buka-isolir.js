function generatePreview(event) {
    event.preventDefault();

    try {
        // 1. Ambil Input Pelanggan
        const namaPelanggan = document.getElementById('namaPelanggan')?.value || '-';
        const noLayanan = document.getElementById('noLayanan')?.value || '-';
        const tipeIdentitas = document.getElementById('tipeIdentitas')?.value || '-';
        const nikPelanggan = document.getElementById('nikPelanggan')?.value || '-';
        const alamatPelanggan = document.getElementById('alamatPelanggan')?.value || '-';

        const namaTelkom = document.getElementById('namaTelkom')?.value || 'Yustika Monita';
        const isTtdMonitaChecked = document.getElementById('checkTtdMonita')?.checked;

        // 2. Ambil Input Kuasa
        const namaKuasa = document.getElementById('namaKuasa')?.value;
        const nikKuasa = document.getElementById('nikKuasa')?.value;
        const tipeIdentitasKuasa = document.getElementById('tipeIdentitasKuasa')?.value;
        const alamatKuasa = document.getElementById('alamatKuasa')?.value;

        // --- LOGIKA TEMPEL TTD YUSTIKA MONITA ---
        const imgTtd = document.getElementById('imgTtdMonita');
        if (imgTtd) {
            imgTtd.style.display = isTtdMonitaChecked ? 'block' : 'none';
        }

        // --- MENGISI PREVIEW SURAT ---

        // Pihak 1 (Atas): Pelanggan Utama
        if (document.getElementById('prevPelangganNama')) document.getElementById('prevPelangganNama').innerText = namaPelanggan;
        if (document.getElementById('prevPelangganAlamat')) document.getElementById('prevPelangganAlamat').innerText = alamatPelanggan;
        if (document.getElementById('prevPelangganTipe')) document.getElementById('prevPelangganTipe').innerText = tipeIdentitas;
        if (document.getElementById('prevPelangganNik')) document.getElementById('prevPelangganNik').innerText = nikPelanggan;

        // Pihak 2 (Tengah): Penerima Kuasa (Tampil Jika Diisi)
        const containerKuasa = document.getElementById('containerPrevKuasa');
        if (namaKuasa && namaKuasa.trim() !== '') {
            if (containerKuasa) containerKuasa.style.display = 'block';
            if (document.getElementById('prevKuasaNama')) document.getElementById('prevKuasaNama').innerText = namaKuasa;
            if (document.getElementById('prevKuasaAlamat')) document.getElementById('prevKuasaAlamat').innerText = alamatKuasa || '-';
            if (document.getElementById('prevKuasaTipe')) document.getElementById('prevKuasaTipe').innerText = tipeIdentitasKuasa || '-';
            if (document.getElementById('prevKuasaNik')) document.getElementById('prevKuasaNik').innerText = nikKuasa || '-';

            if (document.getElementById('prevSignPelanggan')) document.getElementById('prevSignPelanggan').innerText = namaKuasa;
        } else {
            if (containerKuasa) containerKuasa.style.display = 'none';
            if (document.getElementById('prevSignPelanggan')) document.getElementById('prevSignPelanggan').innerText = namaPelanggan;
        }

        // Detail Layanan
        if (document.getElementById('prevNoLayanan')) document.getElementById('prevNoLayanan').innerText = noLayanan;
        if (document.getElementById('prevAtasNamaLayanan')) document.getElementById('prevAtasNamaLayanan').innerText = namaPelanggan;
        if (document.getElementById('prevAlamatLayanan')) document.getElementById('prevAlamatLayanan').innerText = alamatPelanggan;

        if (document.getElementById('prevSignPenanggungJawab')) document.getElementById('prevSignPenanggungJawab').innerText = namaTelkom;

        // Tanggal Realtime
        const today = new Date();
        if (document.getElementById('prevRealtimeDate')) {
            document.getElementById('prevRealtimeDate').innerText = `Banyuwangi, ${today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        }

        // Tampilkan Preview & Aktifkan Tombol Unduh PDF
        const emptyState = document.getElementById('emptyState');
        const letterPaper = document.getElementById('letterPaper');
        const btnDownload = document.getElementById('btnDownload');

        if (emptyState) emptyState.style.display = 'none';
        if (letterPaper) letterPaper.style.display = 'block';
        if (btnDownload) btnDownload.disabled = false;

    } catch (error) {
        console.error("Gagal memproses preview:", error);
        alert("Terjadi kesalahan saat membuat preview.");
    }
}

// Unduh PDF Presisi (Pas 1 Halaman A4)
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById('letterPaper');
    const namaPelanggan = document.getElementById('namaPelanggan')?.value || 'Pelanggan';

    const originalTransform = element.style.transform;
    const originalBoxShadow = element.style.boxShadow;

    element.style.transform = 'scale(1)';
    element.style.boxShadow = 'none';

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const marginX = 8;
        const marginY = 8;
        const maxPrintWidth = pdfWidth - (marginX * 2);
        const maxPrintHeight = pdfHeight - (marginY * 2);

        let printWidth = maxPrintWidth;
        let printHeight = (canvas.height * printWidth) / canvas.width;

        if (printHeight > maxPrintHeight) {
            printHeight = maxPrintHeight;
            printWidth = (canvas.width * printHeight) / canvas.height;
        }

        const posX = (pdfWidth - printWidth) / 2;
        const posY = marginY;

        pdf.addImage(imgData, 'JPEG', posX, posY, printWidth, printHeight);
        pdf.save(`Surat_Buka_Isolir_${namaPelanggan.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
        console.error("Gagal mengunduh PDF:", error);
        alert("Terjadi kesalahan saat mendownload PDF.");
    } finally {
        element.style.transform = originalTransform;
        element.style.boxShadow = originalBoxShadow;
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