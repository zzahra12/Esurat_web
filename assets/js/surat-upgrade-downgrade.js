// ==========================================================================
// 1. GENERATE PREVIEW SURAT MODIFIKASI LAYANAN (UPGRADE / DOWNGRADE)
// ==========================================================================
function generatePreview(event) {
    if (event) event.preventDefault();

    try {
        const getValue = (id, defaultValue = '') => {
            const el = document.getElementById(id);
            return (el && el.value.trim() !== '') ? el.value.trim() : defaultValue;
        };

        // Data Pelanggan Utama
        const namaPelanggan = getValue('namaPelanggan', '-');
        const noLayanan = getValue('noLayanan', '-');
        const tipeIdentitas = getValue('tipeIdentitas', '-');
        const nikPelanggan = getValue('nikPelanggan', '-');
        const alamatPelanggan = getValue('alamatPelanggan', '-');
        const atasNamaLayanan = getValue('atasNamaLayanan', '-');
        const alamatLayanan = getValue('alamatLayanan', '-');

        // Data Detail Modifikasi Layanan (Upgrade / Downgrade)
        const jenisPermohonan = getValue('jenisPermohonan', '-');
        const namaTransaksi = getValue('namaTransaksi', '-');
        const keteranganModifikasi = getValue('keteranganModifikasi', '-');
        const tagihan = getValue('tagihan', '-');

        const namaTelkom = getValue('namaTelkom', 'Yustika Monita');
        const isTtdMonitaChecked = document.getElementById('checkTtdMonita')?.checked || false;

        // Data Penerima Kuasa
        const namaKuasa = getValue('namaKuasa');
        const nikKuasa = getValue('nikKuasa');
        const tipeIdentitasKuasa = getValue('tipeIdentitasKuasa');
        const alamatKuasa = getValue('alamatKuasa');

        // Toggle TTD Monita
        const imgTtd = document.getElementById('imgTtdMonita');
        if (imgTtd) {
            imgTtd.style.display = isTtdMonitaChecked ? 'block' : 'none';
        }

        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.innerText = text;
        };

        // Set Data ke Preview
        setText('prevPelangganNama', namaPelanggan);
        setText('prevPelangganAlamat', alamatPelanggan);
        setText('prevPelangganTipe', tipeIdentitas);
        setText('prevPelangganNik', nikPelanggan);

        // Pengaturan Kondisional Blok Penerima Kuasa (Sembunyi Otomatis Jika Kosong)
        const blockKuasa = document.getElementById('blockKuasa') || document.querySelector('.kuasa-section');
        if (blockKuasa) {
            if (!namaKuasa) {
                blockKuasa.style.display = 'none';
            } else {
                blockKuasa.style.display = 'block';
                setText('prevKuasaNama', namaKuasa);
                setText('prevKuasaAlamat', alamatKuasa);
                setText('prevKuasaTipe', tipeIdentitasKuasa);
                setText('prevKuasaNik', nikKuasa);
            }
        } else {
            setText('prevKuasaNama', namaKuasa);
            setText('prevKuasaAlamat', alamatKuasa);
            setText('prevKuasaTipe', tipeIdentitasKuasa);
            setText('prevKuasaNik', nikKuasa);
        }

        setText('prevNoLayanan', noLayanan);
        setText('prevAtasNamaLayanan', atasNamaLayanan);
        setText('prevAlamatLayanan', alamatLayanan);

        // Detail Poin Modifikasi Sesuai Template
        setText('prevJenisPermohonan', jenisPermohonan);
        setText('prevNamaTransaksi', namaTransaksi);
        setText('prevKeteranganModifikasi', keteranganModifikasi);
        setText('prevTagihan', tagihan);

        setText('prevSignPelanggan', namaPelanggan);
        setText('prevSignPenanggungJawab', namaTelkom);

        // Tanggal Realtime
        const today = new Date();
        setText('prevRealtimeDate', `Banyuwangi, ${today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`);

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
        console.error("Gagal memproses preview Surat Modifikasi Layanan:", error);
        alert("Terjadi kesalahan saat membuat preview.");
    }
}

// ==========================================================================
// 2. DOWNLOAD PDF (SURAT MODIFIKASI LAYANAN - MARGIN ATAS 18MM & PRESISI A4)
// ==========================================================================
async function downloadPDF() {
    const btnDownload = document.getElementById('btnDownload');
    const element = document.getElementById('letterPaper');
    const namaPelanggan = document.getElementById('namaPelanggan')?.value || 'Pelanggan';

    if (!element) {
        alert("Elemen lembar surat tidak ditemukan.");
        return;
    }

    if (btnDownload) {
        btnDownload.disabled = true;
        btnDownload.innerText = "Mengunduh...";
    }

    // --- STYLE INJECTION: MARGIN ATAS 18MM & SPASI KONSISTEN MODIFIKASI ---
    let pdfStyle = document.getElementById('pdfExportStyle');
    if (!pdfStyle) {
        pdfStyle = document.createElement('style');
        pdfStyle.id = 'pdfExportStyle';
        document.head.appendChild(pdfStyle);
    }
    pdfStyle.innerHTML = `
        #letterPaper {
            padding-top: 18mm !important;
            padding-bottom: 5mm !important;
        }
        #letterPaper .paragraph {
            margin-top: 3pt !important;
            margin-bottom: 3pt !important;
        }
        #letterPaper .data-table {
            margin-top: 2.5pt !important;
            margin-bottom: 3.5pt !important;
        }
        #letterPaper .data-table td {
            padding: 1.8pt 0 !important;
        }
        #letterPaper .statement-title {
            margin: 6pt 0 3pt 0 !important;
        }
        #letterPaper .keterangan-list {
            margin-bottom: 4pt !important;
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
                pdf.save(`Surat_Modifikasi_Layanan_${namaPelanggan.replace(/\s+/g, '_')}.pdf`);
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
        console.error("Gagal mengunduh PDF:", error);
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
// 3. KONTROL ZOOM & FULLSCREEN PREVIEW
// ==========================================================================
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