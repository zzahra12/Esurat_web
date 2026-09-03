document.addEventListener('DOMContentLoaded', () => {
    // Set default tanggal input form ke tanggal hari ini secara otomatis
    const inputTgl = document.getElementById('tglSurat');
    if (inputTgl && !inputTgl.value) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        inputTgl.value = `${yyyy}-${mm}-${dd}`;
    }
});

function generatePreview(event) {
    event.preventDefault();

    try {
        const namaTelda = document.getElementById('namaTelda')?.value || 'BANYUWANGI';
        const noLayanan = document.getElementById('noLayanan')?.value || '-';
        const paketWms = document.getElementById('paketWms')?.value || '-';

        const namaPelanggan = document.getElementById('namaPelanggan')?.value || '-';
        const nikPelanggan = document.getElementById('nikPelanggan')?.value || '-';
        const noHpPelanggan = document.getElementById('noHpPelanggan')?.value || '-';
        const alamatPelanggan = document.getElementById('alamatPelanggan')?.value || '-';

        // Set TELDA pada Subtitle
        if (document.getElementById('prevTelda')) {
            document.getElementById('prevTelda').innerText = namaTelda.toUpperCase();
        }

        // Output Data Pelanggan Utama (Tabel)
        if (document.getElementById('prevPelangganNama')) document.getElementById('prevPelangganNama').innerText = namaPelanggan;
        if (document.getElementById('prevPelangganNik')) document.getElementById('prevPelangganNik').innerText = nikPelanggan;
        if (document.getElementById('prevPelangganAlamat')) document.getElementById('prevPelangganAlamat').innerText = alamatPelanggan;
        if (document.getElementById('prevPelangganHp')) document.getElementById('prevPelangganHp').innerText = noHpPelanggan;
        if (document.getElementById('prevNoLayanan')) document.getElementById('prevNoLayanan').innerText = noLayanan;
        if (document.getElementById('prevPaketWms')) document.getElementById('prevPaketWms').innerText = paketWms;

        // Nama di dalam kurung TTD
        const elSign = document.getElementById('prevSignPelanggan');
        if (elSign) {
            elSign.innerText = (namaPelanggan !== '-' && namaPelanggan !== '') ? namaPelanggan : '....................................';
        }

        // Teks di bawah TTD berubah mengikuti Nama Pelanggan
        const elSubSign = document.getElementById('prevSubSignPelanggan');
        if (elSubSign) {
            elSubSign.innerText = (namaPelanggan !== '-' && namaPelanggan !== '') ? namaPelanggan : 'Pelanggan Telkom';
        }

        // LOGIKA PENANGGALAN REAL-TIME (TEMPAT, TANGGAL BULAN TAHUN)
        const inputTglVal = document.getElementById('tglSurat')?.value;
        const namaKotaFormatted = namaTelda.charAt(0).toUpperCase() + namaTelda.slice(1).toLowerCase();

        let dateObj;
        if (inputTglVal) {
            dateObj = new Date(inputTglVal);
        } else {
            dateObj = new Date(); // Realtime sistem hari ini
        }

        // Format Tanggal Indonesia (Contoh: Banyuwangi, 3 September 2026)
        const tglFormatted = dateObj.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        if (document.getElementById('prevRealtimeDate')) {
            document.getElementById('prevRealtimeDate').innerText = `${namaKotaFormatted}, ${tglFormatted}`;
        }

        if (document.getElementById('prevTahunHeader')) {
            document.getElementById('prevTahunHeader').innerText = dateObj.getFullYear();
        }

        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('paperWrapper').style.display = 'flex';
        document.getElementById('btnDownload').disabled = false;

    } catch (error) {
        console.error("Gagal memproses preview:", error);
        alert("Terjadi kesalahan saat membuat preview.");
    }
}

// EKSPOR PDF 1 HALAMAN A4 PRESISI
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const page1 = document.getElementById('page1');
    const namaPelanggan = document.getElementById('namaPelanggan')?.value || 'Pelanggan';

    const originalStyle = page1.getAttribute('style') || '';
    page1.setAttribute('style', originalStyle + '; width: 794px !important; min-width: 794px !important; padding: 45px 50px !important; font-size: 12px !important; line-height: 1.45 !important;');

    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const canvas = await html2canvas(page1, { scale: 2, useCORS: true, logging: false });
        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Surat_Pernyataan_WMS_${namaPelanggan.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
        console.error("Gagal mengunduh PDF:", error);
        alert("Terjadi kesalahan saat mendownload PDF.");
    } finally {
        page1.setAttribute('style', originalStyle);
    }
}

// Kontrol Zoom
let currentScale = 1;
function zoomIn() { if (currentScale < 1.3) { currentScale += 0.1; applyZoom(); } }
function zoomOut() { if (currentScale > 0.5) { currentScale -= 0.1; applyZoom(); } }
function applyZoom() {
    const page = document.getElementById('page1');
    if (page) {
        page.style.transform = `scale(${currentScale})`;
        page.style.transformOrigin = 'top center';
        page.style.transition = 'transform 0.2s ease';
    }
}
function toggleFullscreen() {
    const previewCard = document.querySelector('.card-preview');
    if (previewCard) previewCard.classList.toggle('fullscreen-mode');
}