// ==========================================================================
// DATA MASTER PENANDATANGAN
// ==========================================================================
const DATA_PENGAJU = {
    ericha: {
        nama: "Ericha Septyan Dinata",
        namaKapital: "ERICHA SEPTYAN DINATA",
        nik: "NIK.405595",
        jabatan: "ACCOUNT MANAGER GS",
        lokasi: "BANYUWANGI",
        imgTtd: "assets/images/ttd-Ericha.jpeg"
    },
    azki: {
        nama: "Azki Zarkasi Muhammad",
        namaKapital: "AZKI ZARKASI MUHAMMAD",
        nik: "NIK.405591",
        jabatan: "ACCOUNT MANAGER GS",
        lokasi: "BANYUWANGI",
        imgTtd: "assets/images/ttd-Azki.jpeg"
    },
    yustika: {
        nama: "Yustika Monita",
        namaKapital: "YUSTIKA MONITA",
        nik: "NIK.980213",
        jabatan: "OFF 3 SO & CC",
        lokasi: "BANYUWANGI",
        imgTtd: "assets/images/ttd-telkom.jpg"
    }
};

// Set Tanggal Default ke Hari Ini
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
// GENERATE PREVIEW SURAT TUGAS KBM
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

        // 1. Data Dropdown Pengaju
        const selectedPengajuKey = document.getElementById('selectPengaju')?.value || 'ericha';
        const pengajuInfo = DATA_PENGAJU[selectedPengajuKey] || DATA_PENGAJU.ericha;

        // 2. Data Form Input Manual
        const unitLoker = getValue('unitLoker', '-');
        const lokasiTujuan = getValue('lokasiTujuan', '-');
        const jenisBbm = getValue('jenisBbm', 'Pertamax');
        const kotaSurat = getValue('kotaSurat', 'Banyuwangi');
        const deskripsiKegiatan = getValue('deskripsiKegiatan', '-');

        // 3. Set Preview Teks
        setText('prevNama', pengajuInfo.nama);
        setText('prevUnitLoker', unitLoker);
        setText('prevLokasiTujuan', lokasiTujuan);
        setText('prevJenisBbm', jenisBbm);
        setText('prevDeskripsi', deskripsiKegiatan);

        // 4. Set Detail TTD Pengaju
        setText('prevSignNik', pengajuInfo.nik);
        setText('prevSignNama', pengajuInfo.namaKapital);
        setText('prevSignJabatan', pengajuInfo.jabatan);
        setText('prevSignKota', pengajuInfo.lokasi);

        // 5. Update Gambar TTD Pengaju
        const imgElement = document.getElementById('imgTtdPengaju');
        if (imgElement) {
            imgElement.src = pengajuInfo.imgTtd;
        }

        // 6. Format Tanggal Rapi Tanpa Tanda Garing (Banyuwangi, 13 Agustus 2026)
        const inputTgl = document.getElementById('tglSurat')?.value;
        const dateObj = inputTgl ? new Date(inputTgl) : new Date();
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        
        const day = dateObj.getDate();
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();
        
        setText('prevTglKota', `${kotaSurat}, ${day} ${month} ${year}`);

        // 7. Tampilkan Preview Paper
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
// DOWNLOAD PDF SURAT TUGAS KBM
// ==========================================================================
async function downloadPDF() {
    const btnDownload = document.getElementById('btnDownload');
    const element = document.getElementById('page1');
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
        if (btnDownload) {
            btnDownload.disabled = false;
            btnDownload.innerText = "Unduh PDF";
        }
    }
}

// ==========================================================================
// KONTROL ZOOM & FULLSCREEN
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