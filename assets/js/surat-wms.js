document.addEventListener('DOMContentLoaded', () => {
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
        // Input Layanan & TELDA
        const namaTelda = document.getElementById('namaTelda')?.value || 'BANYUWANGI';
        const noLayanan = document.getElementById('noLayanan')?.value || '-';
        const paketWms = document.getElementById('paketWms')?.value || '-';

        // Input Pelanggan Utama
        const namaPelanggan = document.getElementById('namaPelanggan')?.value || '-';
        const nikPelanggan = document.getElementById('nikPelanggan')?.value || '-';
        const noHpPelanggan = document.getElementById('noHpPelanggan')?.value || '-';
        const alamatPelanggan = document.getElementById('alamatPelanggan')?.value || '-';

        // Output Subtitle TELDA
        if (document.getElementById('prevTelda')) {
            document.getElementById('prevTelda').innerText = namaTelda.toUpperCase();
        }

        // Output Data Pelanggan Utama (Tabel Atas)
        if (document.getElementById('prevPelangganNama')) document.getElementById('prevPelangganNama').innerText = namaPelanggan;
        if (document.getElementById('prevPelangganNik')) document.getElementById('prevPelangganNik').innerText = nikPelanggan;
        if (document.getElementById('prevPelangganAlamat')) document.getElementById('prevPelangganAlamat').innerText = alamatPelanggan;
        if (document.getElementById('prevPelangganHp')) document.getElementById('prevPelangganHp').innerText = noHpPelanggan;

        // Output Layanan WMS
        if (document.getElementById('prevNoLayanan')) document.getElementById('prevNoLayanan').innerText = noLayanan;
        if (document.getElementById('prevPaketWms')) document.getElementById('prevPaketWms').innerText = paketWms;

        // NAMA TTD OTOMATIS TERISI SESUAI NAMA PELANGGAN
        if (document.getElementById('prevSignPelanggan')) {
            document.getElementById('prevSignPelanggan').innerText = namaPelanggan;
        }

        // Tanggal Realtime (Kota, Tanggal Bulan Tahun)
        const inputTglVal = document.getElementById('tglSurat')?.value;
        const namaKotaFormatted = namaTelda.charAt(0).toUpperCase() + namaTelda.slice(1).toLowerCase();

        if (document.getElementById('prevRealtimeDate')) {
            if (inputTglVal) {
                const dateObj = new Date(inputTglVal);
                document.getElementById('prevRealtimeDate').innerText = `${namaKotaFormatted}, ${dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
            } else {
                const today = new Date();
                document.getElementById('prevRealtimeDate').innerText = `${namaKotaFormatted}, ${today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
            }
        }

        // Tampilkan Preview & Aktifkan Download
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('letterPaper').style.display = 'block';
        document.getElementById('btnDownload').disabled = false;

    } catch (error) {
        console.error("Gagal memproses preview:", error);
        alert("Terjadi kesalahan saat membuat preview.");
    }
}

// Unduh PDF A4
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
        pdf.save(`Surat_Pernyataan_WMS_${namaPelanggan.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
        console.error("Gagal mengunduh PDF:", error);
        alert("Terjadi kesalahan saat mendownload PDF.");
    } finally {
        element.style.transform = originalTransform;
        element.style.boxShadow = originalBoxShadow;
    }
}

// Kontrol Zoom & Fullscreen
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