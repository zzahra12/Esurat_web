// Fungsi Accordion Kuasa
function toggleKuasaSection() {
    const content = document.getElementById("kuasaContent");
    const arrow = document.getElementById("kuasaArrow");

    if (content.style.display === "block") {
        content.style.display = "none";
        arrow.style.transform = "rotate(0deg)";
    } else {
        content.style.display = "block";
        arrow.style.transform = "rotate(90deg)";
    }
}

// Fungsi Generate Preview
function generatePreview(event) {
    event.preventDefault();

    try {
        // Format Tanggal Indonesia
        const formatDateIndo = (dateString) => {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        };

        // 1. Ambil Data Pelanggan Utama (kadja)
        const namaPelanggan = document.getElementById('namaPelanggan')?.value || '-';
        const noLayanan = document.getElementById('noLayanan')?.value || '-';
        const tipeIdentitas = document.getElementById('tipeIdentitas')?.value || '-';
        const nikPelanggan = document.getElementById('nikPelanggan')?.value || '-';
        const alamatPelanggan = document.getElementById('alamatPelanggan')?.value || '-';

        // 2. Ambil Data Detail Isolir
        const durasiIsolir = document.getElementById('durasiIsolir')?.value || '-';
        const tglMulaiIsolirVal = document.getElementById('tglMulaiIsolir')?.value;
        const tglBukaIsolirVal = document.getElementById('tglBukaIsolir')?.value;
        const keteranganIsolir = document.getElementById('keteranganIsolir')?.value || '-';
        const namaTelkom = document.getElementById('namaTelkom')?.value || 'Yustika Monita';

        // 3. Ambil Data Penerima Kuasa (aaa)
        const namaKuasa = document.getElementById('namaKuasa')?.value;
        const nikKuasa = document.getElementById('nikKuasa')?.value;
        const tipeIdentitasKuasa = document.getElementById('tipeIdentitasKuasa')?.value;
        const alamatKuasa = document.getElementById('alamatKuasa')?.value;

        // 4. PENYESUAIAN POSISI:
        // Blok Atas ("Yang bertanda tangan di bawah ini") = PELANGGAN UTAMA (kadja)
        if (document.getElementById('prevYangBertandaTanganNama')) document.getElementById('prevYangBertandaTanganNama').innerText = namaPelanggan;
        if (document.getElementById('prevYangBertandaTanganAlamat')) document.getElementById('prevYangBertandaTanganAlamat').innerText = alamatPelanggan;
        if (document.getElementById('prevYangBertandaTanganTipe')) document.getElementById('prevYangBertandaTanganTipe').innerText = tipeIdentitas;
        if (document.getElementById('prevYangBertandaTanganNik')) document.getElementById('prevYangBertandaTanganNik').innerText = nikPelanggan;

        // Blok Tengah ("Bertindak untuk dan atas nama") = PENERIMA KUASA (aaa)
        const containerKuasa = document.getElementById('containerPrevKuasa');

        if (namaKuasa && namaKuasa.trim() !== '') {
            if (containerKuasa) containerKuasa.style.display = 'block';

            if (document.getElementById('prevAtasNamaPelangganNama')) document.getElementById('prevAtasNamaPelangganNama').innerText = namaKuasa;
            if (document.getElementById('prevAtasNamaPelangganAlamat')) document.getElementById('prevAtasNamaPelangganAlamat').innerText = alamatKuasa || '-';
            if (document.getElementById('prevAtasNamaPelangganTipe')) document.getElementById('prevAtasNamaPelangganTipe').innerText = tipeIdentitasKuasa || '-';
            if (document.getElementById('prevAtasNamaPelangganNik')) document.getElementById('prevAtasNamaPelangganNik').innerText = nikKuasa || '-';

            if (document.getElementById('prevSignPelanggan')) document.getElementById('prevSignPelanggan').innerText = namaKuasa;
        } else {
            if (containerKuasa) containerKuasa.style.display = 'none';
            if (document.getElementById('prevSignPelanggan')) document.getElementById('prevSignPelanggan').innerText = namaPelanggan;
        }

        // 5. Data Layanan
        if (document.getElementById('prevNoLayanan')) document.getElementById('prevNoLayanan').innerText = noLayanan;
        if (document.getElementById('prevAtasNamaLayanan')) document.getElementById('prevAtasNamaLayanan').innerText = namaPelanggan;
        if (document.getElementById('prevAlamatLayanan')) document.getElementById('prevAlamatLayanan').innerText = alamatPelanggan;

        if (document.getElementById('prevDurasiIsolir')) document.getElementById('prevDurasiIsolir').innerText = durasiIsolir;
        if (document.getElementById('prevTglMulaiIsolir')) document.getElementById('prevTglMulaiIsolir').innerText = formatDateIndo(tglMulaiIsolirVal);
        if (document.getElementById('prevTglBukaIsolir')) document.getElementById('prevTglBukaIsolir').innerText = formatDateIndo(tglBukaIsolirVal);
        if (document.getElementById('prevKeterangan')) document.getElementById('prevKeterangan').innerText = keteranganIsolir;

        if (document.getElementById('prevSignPenanggungJawab')) document.getElementById('prevSignPenanggungJawab').innerText = namaTelkom;

        // Tanggal Realtime
        const today = new Date();
        const formattedDate = today.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        if (document.getElementById('prevRealtimeDate')) {
            document.getElementById('prevRealtimeDate').innerText = `Banyuwangi, ${formattedDate}`;
        }

        // Tampilkan Preview
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

// Unduh PDF Presisi
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
        const marginX = 10;
        const marginY = 10;
        const printWidth = pdfWidth - (marginX * 2);
        const printHeight = (canvas.height * printWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', marginX, marginY, printWidth, printHeight);
        pdf.save(`Surat_Isolir_${namaPelanggan.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
        console.error("Gagal mengunduh PDF:", error);
        alert("Terjadi kesalahan saat mendownload PDF.");
    } finally {
        element.style.transform = originalTransform;
        element.style.boxShadow = originalBoxShadow;
    }
}

// Zoom & Fullscreen
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