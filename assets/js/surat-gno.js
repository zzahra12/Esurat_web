function generatePreview(event) {
    event.preventDefault();

    try {
        // 1. Ambil Input Pelanggan Lama
        const namaPelanggan = document.getElementById('namaPelanggan')?.value || '-';
        const noLayanan = document.getElementById('noLayanan')?.value || '-';
        const tipeIdentitas = document.getElementById('tipeIdentitas')?.value || '-';
        const nikPelanggan = document.getElementById('nikPelanggan')?.value || '-';
        const alamatPelanggan = document.getElementById('alamatPelanggan')?.value || '-';

        // 2. Ambil Input Pelanggan Baru (GNO)
        const namaBaru = document.getElementById('namaBaru')?.value || '-';
        const nikBaru = document.getElementById('nikBaru')?.value || '-';
        const tipeIdentitasBaru = document.getElementById('tipeIdentitasBaru')?.value || '-';
        const alamatBaru = document.getElementById('alamatBaru')?.value || '-';
        
        const keteranganInput = document.getElementById('keteranganTambahan')?.value;
        const keterangan = (keteranganInput && keteranganInput.trim() !== '') ? keteranganInput.trim() : '-';

        const namaTelkom = document.getElementById('namaTelkom')?.value || 'Yustika Monita';
        const isTtdChecked = document.getElementById('checkTtdMonita')?.checked;

        // 3. Ambil Input Kuasa (Fallback Strip '-' Jika Kosong)
        const namaKuasaInput = document.getElementById('namaKuasa')?.value;
        const nikKuasaInput = document.getElementById('nikKuasa')?.value;
        const tipeIdentitasKuasaInput = document.getElementById('tipeIdentitasKuasa')?.value;
        const alamatKuasaInput = document.getElementById('alamatKuasa')?.value;

        const namaKuasa = (namaKuasaInput && namaKuasaInput.trim() !== '') ? namaKuasaInput.trim() : '-';
        const nikKuasa = (nikKuasaInput && nikKuasaInput.trim() !== '') ? nikKuasaInput.trim() : '-';
        const tipeIdentitasKuasa = (tipeIdentitasKuasaInput && tipeIdentitasKuasaInput.trim() !== '') ? tipeIdentitasKuasaInput.trim() : '-';
        const alamatKuasa = (alamatKuasaInput && alamatKuasaInput.trim() !== '') ? alamatKuasaInput.trim() : '-';

        // --- LOGIKA TEMPEL TTD TELKOM ---
        const imgTtd = document.getElementById('imgTtdMonita');
        if (imgTtd) {
            imgTtd.style.display = isTtdChecked ? 'block' : 'none';
        }

        // --- MENGISI PREVIEW LEMBAR SURAT (POSISI POSITIF & TERKUNCI) ---

        // Pihak Atas: Yang bertanda tangan di bawah ini = SELALU Pelanggan Lama
        if (document.getElementById('prevPelangganNama')) document.getElementById('prevPelangganNama').innerText = namaPelanggan;
        if (document.getElementById('prevPelangganAlamat')) document.getElementById('prevPelangganAlamat').innerText = alamatPelanggan;
        if (document.getElementById('prevPelangganTipe')) document.getElementById('prevPelangganTipe').innerText = tipeIdentitas;
        if (document.getElementById('prevPelangganNik')) document.getElementById('prevPelangganNik').innerText = nikPelanggan;

        // Pihak Tengah: Bertindak untuk dan atas nama = SELALU Penerima Kuasa (Tampil '-' Jika Kosong)
        if (document.getElementById('prevKuasaNama')) document.getElementById('prevKuasaNama').innerText = namaKuasa;
        if (document.getElementById('prevKuasaAlamat')) document.getElementById('prevKuasaAlamat').innerText = alamatKuasa;
        if (document.getElementById('prevKuasaTipe')) document.getElementById('prevKuasaTipe').innerText = tipeIdentitasKuasa;
        if (document.getElementById('prevKuasaNik')) document.getElementById('prevKuasaNik').innerText = nikKuasa;

        // Tanda Tangan Pelanggan: SELALU PAKAI NAMA PELANGGAN LAMA
        if (document.getElementById('prevSignPelanggan')) {
            document.getElementById('prevSignPelanggan').innerText = namaPelanggan;
        }

        // Data Layanan & Pelanggan Baru (GNO)
        if (document.getElementById('prevNoLayanan')) document.getElementById('prevNoLayanan').innerText = noLayanan;
        if (document.getElementById('prevAtasNamaLayanan')) document.getElementById('prevAtasNamaLayanan').innerText = namaPelanggan;
        if (document.getElementById('prevAlamatLayanan')) document.getElementById('prevAlamatLayanan').innerText = alamatPelanggan;

        if (document.getElementById('prevNamaBaru')) document.getElementById('prevNamaBaru').innerText = namaBaru;
        if (document.getElementById('prevAlamatBaru')) document.getElementById('prevAlamatBaru').innerText = alamatBaru;
        if (document.getElementById('prevTipeIdentitasBaru')) document.getElementById('prevTipeIdentitasBaru').innerText = tipeIdentitasBaru;
        if (document.getElementById('prevNikBaru')) document.getElementById('prevNikBaru').innerText = nikBaru;
        if (document.getElementById('prevKeterangan')) document.getElementById('prevKeterangan').innerText = keterangan;

        if (document.getElementById('prevSignPenanggungJawab')) document.getElementById('prevSignPenanggungJawab').innerText = namaTelkom;

        // Tanggal Realtime
        const today = new Date();
        if (document.getElementById('prevRealtimeDate')) {
            document.getElementById('prevRealtimeDate').innerText = `Banyuwangi, ${today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        }

        // --- TAMPILKAN PREVIEW & BUKA KUNCI TOMBOL UNDUH ---
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
        console.error("Gagal memproses preview:", error);
        alert("Terjadi kesalahan saat membuat preview.");
    }
}

// Unduh PDF Presisi (Pas 1 Halaman A4)
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
        const { jsPDF } = window.jspdf;

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
        pdf.save(`Surat_GNO_${namaPelanggan.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
        console.error("Gagal mengunduh PDF:", error);
        alert("Gagal mengunduh PDF. Pastikan library html2canvas & jsPDF terhubung.");
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