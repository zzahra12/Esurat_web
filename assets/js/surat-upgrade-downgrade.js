function generatePreview(event) {
    event.preventDefault();

    try {
        // Data Pelanggan Utama
        const namaPelanggan = document.getElementById('namaPelanggan')?.value || '-';
        const noLayanan = document.getElementById('noLayanan')?.value || '-';
        const tipeIdentitas = document.getElementById('tipeIdentitas')?.value || '-';
        const nikPelanggan = document.getElementById('nikPelanggan')?.value || '-';
        const alamatPelanggan = document.getElementById('alamatPelanggan')?.value || '-';

        // Data Paket
        const paketLama = document.getElementById('paketLama')?.value || '-';
        const paketBaru = document.getElementById('paketBaru')?.value || '-';
        const keterangan = document.getElementById('keteranganTambahan')?.value || '-';

        const namaTelkom = document.getElementById('namaTelkom')?.value || 'Yustika Monita';
        const isTtdMonitaChecked = document.getElementById('checkTtdMonita')?.checked;

        // Data Kuasa
        const namaKuasa = document.getElementById('namaKuasa')?.value;
        const nikKuasa = document.getElementById('nikKuasa')?.value;
        const tipeIdentitasKuasa = document.getElementById('tipeIdentitasKuasa')?.value;
        const alamatKuasa = document.getElementById('alamatKuasa')?.value;

        // TTD TOGGLE YUSTIKA MONITA
        const imgTtd = document.getElementById('imgTtdMonita');
        if (imgTtd) {
            imgTtd.style.display = isTtdMonitaChecked ? 'block' : 'none';
        }

        // --- MENGATUR POSISI YANG BENAR (TIDAK TERBALIK) ---
        const containerKuasa = document.getElementById('containerPrevKuasa');

        if (namaKuasa && namaKuasa.trim() !== '') {
            // Jika Menggunakan Kuasa:
            // Atas = Penerima Kuasa
            if (document.getElementById('prevPelangganNama')) document.getElementById('prevPelangganNama').innerText = namaKuasa;
            if (document.getElementById('prevPelangganAlamat')) document.getElementById('prevPelangganAlamat').innerText = alamatKuasa || '-';
            if (document.getElementById('prevPelangganTipe')) document.getElementById('prevPelangganTipe').innerText = tipeIdentitasKuasa || '-';
            if (document.getElementById('prevPelangganNik')) document.getElementById('prevPelangganNik').innerText = nikKuasa || '-';

            // Tengah = Pelanggan Utama (Pemilik Layanan)
            if (containerKuasa) containerKuasa.style.display = 'block';
            if (document.getElementById('prevKuasaNama')) document.getElementById('prevKuasaNama').innerText = namaPelanggan;
            if (document.getElementById('prevKuasaAlamat')) document.getElementById('prevKuasaAlamat').innerText = alamatPelanggan;
            if (document.getElementById('prevKuasaTipe')) document.getElementById('prevKuasaTipe').innerText = tipeIdentitas;
            if (document.getElementById('prevKuasaNik')) document.getElementById('prevKuasaNik').innerText = nikPelanggan;

            // TTD Pelanggan diganti nama Penerima Kuasa
            if (document.getElementById('prevSignPelanggan')) document.getElementById('prevSignPelanggan').innerText = namaKuasa;
        } else {
            // Jika Urus Sendiri:
            // Atas = Pelanggan Utama
            if (document.getElementById('prevPelangganNama')) document.getElementById('prevPelangganNama').innerText = namaPelanggan;
            if (document.getElementById('prevPelangganAlamat')) document.getElementById('prevPelangganAlamat').innerText = alamatPelanggan;
            if (document.getElementById('prevPelangganTipe')) document.getElementById('prevPelangganTipe').innerText = tipeIdentitas;
            if (document.getElementById('prevPelangganNik')) document.getElementById('prevPelangganNik').innerText = nikPelanggan;

            // Sembunyikan bagian Kuasa
            if (containerKuasa) containerKuasa.style.display = 'none';

            // TTD Pelanggan tetap Pelanggan Utama
            if (document.getElementById('prevSignPelanggan')) document.getElementById('prevSignPelanggan').innerText = namaPelanggan;
        }

        // Data Layanan
        if (document.getElementById('prevNoLayanan')) document.getElementById('prevNoLayanan').innerText = noLayanan;
        if (document.getElementById('prevAtasNamaLayanan')) document.getElementById('prevAtasNamaLayanan').innerText = namaPelanggan;
        if (document.getElementById('prevAlamatLayanan')) document.getElementById('prevAlamatLayanan').innerText = alamatPelanggan;

        if (document.getElementById('prevPaketLama')) document.getElementById('prevPaketLama').innerText = paketLama;
        if (document.getElementById('prevPaketBaru')) document.getElementById('prevPaketBaru').innerText = paketBaru;
        if (document.getElementById('prevKeterangan')) document.getElementById('prevKeterangan').innerText = keterangan;
        if (document.getElementById('prevSignPenanggungJawab')) document.getElementById('prevSignPenanggungJawab').innerText = namaTelkom;

        // Tanggal Realtime
        const today = new Date();
        if (document.getElementById('prevRealtimeDate')) {
            document.getElementById('prevRealtimeDate').innerText = `Banyuwangi, ${today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        }

        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('letterPaper').style.display = 'block';
        document.getElementById('btnDownload').disabled = false;

    } catch (error) {
        console.error("Gagal memproses preview:", error);
        alert("Terjadi kesalahan saat membuat preview.");
    }
}

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
        pdf.save(`Surat_Upgrade_Downgrade_${namaPelanggan.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
        console.error("Gagal mengunduh PDF:", error);
        alert("Terjadi kesalahan saat mendownload PDF.");
    } finally {
        element.style.transform = originalTransform;
        element.style.boxShadow = originalBoxShadow;
    }
}

let currentScale = 1;
function zoomIn() { if (currentScale < 1.5) { currentScale += 0.1; applyZoom(); } }
function zoomOut() { if (currentScale > 1.0) { currentScale -= 0.1; applyZoom(); } }
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
    if (previewCard) previewCard.classList.toggle('fullscreen-mode');
}