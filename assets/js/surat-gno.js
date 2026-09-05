function generatePreview(event) {
    event.preventDefault();

    try {
        // 1. Data Pelanggan Utama
        const namaPelanggan = document.getElementById('namaPelanggan')?.value || '-';
        const noLayanan = document.getElementById('noLayanan')?.value || '-';
        const tipeIdentitas = document.getElementById('tipeIdentitas')?.value || '-';
        const nikPelanggan = document.getElementById('nikPelanggan')?.value || '-';

        const alamatPelangganInput = document.getElementById('alamatPelanggan')?.value;
        const alamatPelanggan = (alamatPelangganInput && alamatPelangganInput.trim() !== '') ? alamatPelangganInput.trim() : '-';

        const atasNamaLayananInput = document.getElementById('atasNamaLayanan')?.value;
        const atasNamaLayanan = (atasNamaLayananInput && atasNamaLayananInput.trim() !== '') ? atasNamaLayananInput.trim() : '-';

        const alamatLayananInput = document.getElementById('alamatLayanan')?.value;
        const alamatLayanan = (alamatLayananInput && alamatLayananInput.trim() !== '') ? alamatLayananInput.trim() : '-';

        // 2. Data Detail Ganti Nomor (GNO)
        const noTelpLamaInput = document.getElementById('noTelpLama')?.value;
        const noTelpBaruInput = document.getElementById('noTelpBaru')?.value;
        const noInternetLamaInput = document.getElementById('noInternetLama')?.value;
        const noInternetBaruInput = document.getElementById('noInternetBaru')?.value;
        const keteranganInput = document.getElementById('keteranganTambahan')?.value;

        const noTelpLama = (noTelpLamaInput && noTelpLamaInput.trim() !== '') ? noTelpLamaInput.trim() : '-';
        const noTelpBaru = (noTelpBaruInput && noTelpBaruInput.trim() !== '') ? noTelpBaruInput.trim() : '-';
        const noInternetLama = (noInternetLamaInput && noInternetLamaInput.trim() !== '') ? noInternetLamaInput.trim() : '-';
        const noInternetBaru = (noInternetBaruInput && noInternetBaruInput.trim() !== '') ? noInternetBaruInput.trim() : '-';
        const keterangan = (keteranganInput && keteranganInput.trim() !== '') ? keteranganInput.trim() : '-';

        const namaTelkom = document.getElementById('namaTelkom')?.value || 'Yustika Monita';
        const isTtdChecked = document.getElementById('checkTtdMonita')?.checked;

        // 3. Data Kuasa (Fallback Strip '-' Jika Kosong)
        const namaKuasaInput = document.getElementById('namaKuasa')?.value;
        const nikKuasaInput = document.getElementById('nikKuasa')?.value;
        const tipeIdentitasKuasaInput = document.getElementById('tipeIdentitasKuasa')?.value;
        const alamatKuasaInput = document.getElementById('alamatKuasa')?.value;

        const namaKuasa = (namaKuasaInput && namaKuasaInput.trim() !== '') ? namaKuasaInput.trim() : '-';
        const nikKuasa = (nikKuasaInput && nikKuasaInput.trim() !== '') ? nikKuasaInput.trim() : '-';
        const tipeIdentitasKuasa = (tipeIdentitasKuasaInput && tipeIdentitasKuasaInput.trim() !== '') ? tipeIdentitasKuasaInput.trim() : '-';
        const alamatKuasa = (alamatKuasaInput && alamatKuasaInput.trim() !== '') ? alamatKuasaInput.trim() : '-';

        // Toggle Gambar TTD Monita
        const imgTtd = document.getElementById('imgTtdMonita');
        if (imgTtd) {
            imgTtd.style.display = isTtdChecked ? 'block' : 'none';
        }

        // --- MENGISI PREVIEW SURAT ---
        if (document.getElementById('prevPelangganNama')) document.getElementById('prevPelangganNama').innerText = namaPelanggan;
        if (document.getElementById('prevPelangganAlamat')) document.getElementById('prevPelangganAlamat').innerText = alamatPelanggan;
        if (document.getElementById('prevPelangganTipe')) document.getElementById('prevPelangganTipe').innerText = tipeIdentitas;
        if (document.getElementById('prevPelangganNik')) document.getElementById('prevPelangganNik').innerText = nikPelanggan;

        if (document.getElementById('prevKuasaNama')) document.getElementById('prevKuasaNama').innerText = namaKuasa;
        if (document.getElementById('prevKuasaAlamat')) document.getElementById('prevKuasaAlamat').innerText = alamatKuasa;
        if (document.getElementById('prevKuasaTipe')) document.getElementById('prevKuasaTipe').innerText = tipeIdentitasKuasa;
        if (document.getElementById('prevKuasaNik')) document.getElementById('prevKuasaNik').innerText = nikKuasa;

        if (document.getElementById('prevSignPelanggan')) {
            document.getElementById('prevSignPelanggan').innerText = namaPelanggan;
        }

        if (document.getElementById('prevNoLayanan')) document.getElementById('prevNoLayanan').innerText = noLayanan;
        if (document.getElementById('prevAtasNamaLayanan')) document.getElementById('prevAtasNamaLayanan').innerText = atasNamaLayanan;
        if (document.getElementById('prevAlamatLayanan')) document.getElementById('prevAlamatLayanan').innerText = alamatLayanan;

        // Detail Poin a - e untuk Surat GNO
        if (document.getElementById('prevNoTelpLama')) document.getElementById('prevNoTelpLama').innerText = noTelpLama;
        if (document.getElementById('prevNoTelpBaru')) document.getElementById('prevNoTelpBaru').innerText = noTelpBaru;
        if (document.getElementById('prevNoInternetLama')) document.getElementById('prevNoInternetLama').innerText = noInternetLama;
        if (document.getElementById('prevNoInternetBaru')) document.getElementById('prevNoInternetBaru').innerText = noInternetBaru;
        if (document.getElementById('prevKeterangan')) document.getElementById('prevKeterangan').innerText = keterangan;

        if (document.getElementById('prevSignPenanggungJawab')) document.getElementById('prevSignPenanggungJawab').innerText = namaTelkom;

        // Tanggal Realtime
        const today = new Date();
        if (document.getElementById('prevRealtimeDate')) {
            document.getElementById('prevRealtimeDate').innerText = `Banyuwangi, ${today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        }

        // TAMPILKAN PREVIEW & AKTIFKAN TOMBOL
        const emptyState = document.getElementById('emptyState');
        const letterPaper = document.getElementById('letterPaper');
        const btnDownload = document.getElementById('btnDownload');

        if (emptyState) emptyState.style.display = 'none';
        if (letterPaper) letterPaper.style.display = 'block';

        if (btnDownload) {
            btnDownload.disabled = false;
            btnDownload.removeAttribute('disabled');
        }

    } catch (error) {
        console.error("Gagal memproses preview Surat GNO:", error);
        alert("Terjadi kesalahan saat membuat preview.");
    }
}

// Fungsi Unduh PDF Presisi
async function downloadPDF() {
    const btnDownload = document.getElementById('btnDownload');
    const element = document.getElementById('letterPaper');
    const namaPelanggan = document.getElementById('namaPelanggan')?.value || 'Pelanggan';

    if (!element) {
        alert("Elemen surat tidak ditemukan.");
        return;
    }

    if (btnDownload) {
        btnDownload.disabled = true;
        btnDownload.innerText = "Mengunduh...";
    }

    const originalTransform = element.style.transform;
    const originalBoxShadow = element.style.boxShadow;

    element.style.transform = 'scale(1)';
    element.style.boxShadow = 'none';

    try {
        const jsPDF = window.jspdf ? window.jspdf.jsPDF : null;

        if (!jsPDF || typeof html2canvas === 'undefined') {
            alert("Pustaka ekspor PDF belum ter-load sempurna. Pastikan koneksi internet aktif.");
            return;
        }

        const canvas = await html2canvas(element, {
            scale: 2.5,
            useCORS: true,
            logging: false,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const marginX = 4;
        const marginY = 5;
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
        pdf.save(`Surat_GNO_${namaPelanggan.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
        console.error("Gagal mengunduh PDF:", error);
        alert("Terjadi kesalahan saat membuat file PDF: " + error.message);
    } finally {
        element.style.transform = originalTransform;
        element.style.boxShadow = originalBoxShadow;

        if (btnDownload) {
            btnDownload.disabled = false;
            btnDownload.innerText = "Unduh PDF";
        }
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