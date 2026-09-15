// ==========================================================================
// 1. DATA MASTER PENANDATANGAN YANG MENGAJUKAN (DROPDOWN OPTION)
// ==========================================================================
const DATA_PENGAJU = {
    ericha: {
        nama: "Ericha Septyan Dinata",
        namaKapital: "ERICHA SEPTYAN DINATA",
        nik: "NIK.405595",
        jabatan: "ACCOUNT MANAGER GS",
        lokasi: "BANYUWANGI",
        imgTtdId: "imgTtdEricha"
    },
    azki: {
        nama: "Azki Zarkasi Muhammad",
        namaKapital: "AZKI ZARKASI MUHAMMAD",
        nik: "NIK.405596",
        jabatan: "ACCOUNT MANAGER GS",
        lokasi: "BANYUWANGI",
        imgTtdId: "imgTtdAzki"
    },
    yustika: {
        nama: "Yustika Monita",
        namaKapital: "YUSTIKA MONITA",
        nik: "NIK.980213",
        jabatan: "OFF 3 SO & CC",
        lokasi: "BANYUWANGI",
        imgTtdId: "imgTtdMonita"
    }
};

// Default Set Tanggal Surat ke Hari Ini saat Pertama Load DOM
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

// ==========================================================================
// 2. GENERATE PREVIEW SURAT TUGAS KBM & BBM (SAAT KLIK TOMBOL LANJUTKAN)
// ==========================================================================
function generatePreview(event) {
    if (event) event.preventDefault();

    try {
        const getValue = (id, defaultValue = '-') => {
            const el = document.getElementById(id);
            return (el && el.value.trim() !== '') ? el.value.trim() : defaultValue;
        };

        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.innerText = text;
        };

        // Ambil Data Pengaju dari Dropdown Select
        const selectedPengajuKey = document.getElementById('selectPengaju')?.value || 'ericha';
        const pengajuInfo = DATA_PENGAJU[selectedPengajuKey] || DATA_PENGAJU.ericha;

        // Ambil Data Form Lainnya
        const unitLoker = getValue('unitLoker', 'Plaza Telkom Jember, Kb. Kidul, Jember Kidul, Kec. Kaliwates, Kabupaten Jember, Jawa Timur 68131');
        const lokasiTujuan = getValue('lokasiTujuan', 'Jl. Jenderal Ahmad Yani No.131, Parse, Dawuhan, Situbondo, Situbondo Regency, East Java 68311');
        const jenisBbm = getValue('jenisBbm', 'Pertamax');
        const kotaSurat = getValue('kotaSurat', 'Banyuwangi');
        const deskripsiKegiatan = getValue('deskripsiKegiatan', 'KUNJUNGAN PELANGGAN KE BAPENDA, PENGADILAN AGAMA, ROXY SWALAYAN, SPBU KENDIT, SPBU KOTAKAN UTARA, SPBU KOTAKAN SELATAN');

        // Populate Nama di Tabel Atas Secara Otomatis Berdasarkan Dropdown Pengaju
        setText('prevNama', pengajuInfo.nama);
        setText('prevUnitLoker', unitLoker);
        setText('prevLokasiTujuan', lokasiTujuan);
        setText('prevJenisBbm', jenisBbm);
        setText('prevDeskripsi', deskripsiKegiatan);

        // Populate Penanda Tangan Dinamis Sesuai Dropdown (Yang Mengajukan)
        setText('prevSignNik', pengajuInfo.nik);
        setText('prevSignNama', pengajuInfo.namaKapital);
        setText('prevSignJabatan', pengajuInfo.jabatan);
        setText('prevSignKota', pengajuInfo.lokasi);

        // Toggle TTD Gambar Sesuai Pengaju yang Dipilih
        ['imgTtdEricha', 'imgTtdAzki', 'imgTtdMonita'].forEach(id => {
            const img = document.getElementById(id);
            if (img) img.style.display = 'none';
        });

        const activeImg = document.getElementById(pengajuInfo.imgTtdId);
        if (activeImg) activeImg.style.display = 'block';

        // Format Tanggal (Contoh: Banyuwangi, 13/Agustus/2026)
        const inputTgl = document.getElementById('tglSurat')?.value;
        const dateObj = inputTgl ? new Date(inputTgl) : new Date();
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const tglStr = `${dateObj.getDate()}/${monthNames[dateObj.getMonth()]}/${dateObj.getFullYear()}`;
        
        setText('prevTglKota', `${kotaSurat}, ${tglStr}`);

        // TAMPILKAN KERTAS PREVIEW A4 & AKTIFKAN TOMBOL UNDUH
        const emptyState = document.getElementById('emptyState');
        const paperWrapper = document.getElementById('paperWrapper');
        const btnDownload = document.getElementById('btnDownload');

        if (emptyState) emptyState.style.display = 'none';
        if (paperWrapper) paperWrapper.style.display = 'flex';

        if (btnDownload) {
            btnDownload.disabled = false;
            btnDownload.removeAttribute('disabled');
        }

    } catch (error) {
        console.error("Gagal memproses preview Surat Tugas KBM:", error);
        alert("Terjadi kesalahan saat membuat preview.");
    }
}

// ==========================================================================
// 3. DOWNLOAD PDF SURAT TUGAS KBM (PRESISI PAS 1 HALAMAN A4)
// ==========================================================================
async function downloadPDF() {
    const btnDownload = document.getElementById('btnDownload');
    const element = document.getElementById('page1') || document.getElementById('letterPaper');
    const selectedPengajuKey = document.getElementById('selectPengaju')?.value || 'ericha';
    const pengajuInfo = DATA_PENGAJU[selectedPengajuKey] || DATA_PENGAJU.ericha;

    if (!element) {
        alert("Elemen surat tidak ditemukan.");
        return;
    }

    if (btnDownload) {
        btnDownload.disabled = true;
        btnDownload.innerText = "Mengunduh...";
    }

    let pdfStyle = document.getElementById('pdfExportStyle');
    if (!pdfStyle) {
        pdfStyle = document.createElement('style');
        pdfStyle.id = 'pdfExportStyle';
        document.head.appendChild(pdfStyle);
    }
    pdfStyle.innerHTML = `
        #page1 {
            padding: 1.27cm 2.54cm !important;
        }
        #page1 .kbm-table td {
            padding: 2.5pt 0 !important;
        }
        #page1 .deskripsi-box {
            min-height: 155px !important;
            margin-bottom: 20pt !important;
        }
        #page1 .footer-signature-wrapper {
            position: absolute !important;
            bottom: 1.27cm !important;
            left: 2.54cm !important;
            right: 2.54cm !important;
        }
    `;

    try {
        const jsPDFLib = window.jspdf ? (window.jspdf.jsPDF || window.jspdf) : window.jsPDF;

        if (!jsPDFLib) {
            alert("Pustaka jsPDF belum ter-load.");
            return;
        }

        const doc = new jsPDFLib({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        await doc.html(element, {
            callback: function (pdf) {
                pdf.save(`Surat_Tugas_KBM_${pengajuInfo.namaKapital.replace(/\s+/g, '_')}.pdf`);
            },
            x: 0,
            y: 0,
            width: 210,
            windowWidth: 794,
            autoPaging: 'text',
            html2canvas: {
                scale: 0.2645,
                useCORS: true,
                logging: false
            }
        });

    } catch (error) {
        console.error("Gagal mengunduh PDF Surat Tugas KBM:", error);
        alert("Terjadi kesalahan saat membuat PDF: " + error.message);
    } finally {
        if (pdfStyle) {
            pdfStyle.remove();
        }

        if (btnDownload) {
            btnDownload.disabled = false;
            btnDownload.innerText = "Unduh PDF";
        }
    }
}

// ==========================================================================
// 4. KONTROL ZOOM & FULLSCREEN PREVIEW
// ==========================================================================
let currentScale = 1;

function zoomIn() { 
    if (currentScale < 1.4) { 
        currentScale += 0.1; 
        applyZoom(); 
    } 
}

function zoomOut() { 
    if (currentScale > 0.6) { 
        currentScale -= 0.1; 
        applyZoom(); 
    } 
}

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
    if (previewCard) {
        previewCard.classList.toggle('fullscreen-mode');
    }
}