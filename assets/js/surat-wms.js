// ==========================================================================
// 1. SET DEFAULT TANGGAL SURAT KETIKA DOM READY
// ==========================================================================
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
// 2. GENERATE PREVIEW SURAT WMS
// ==========================================================================
function generatePreview(event) {
    if (event) event.preventDefault();

    try {
        const namaTeldaInput = document.getElementById('namaTelda')?.value || 'BANYUWANGI';
        const namaTelda = namaTeldaInput.trim().toUpperCase();

        const noSuratWmsInput = document.getElementById('noSuratWms')?.value || 'TEL. XXXX/YN000/T3W-0B0L0000';
        const noLayanan = document.getElementById('noLayanan')?.value || '-';
        const paketWms = document.getElementById('paketWms')?.value || '-';

        const namaPelanggan = document.getElementById('namaPelanggan')?.value || '-';
        const nikPelanggan = document.getElementById('nikPelanggan')?.value || '-';
        const noHpPelanggan = document.getElementById('noHpPelanggan')?.value || '-';
        const alamatPelanggan = document.getElementById('alamatPelanggan')?.value || '-';

        const kotaTtdInput = document.getElementById('kotaTtd')?.value;
        let kotaTtd = 'Banyuwangi';

        if (kotaTtdInput && kotaTtdInput.trim() !== '') {
            kotaTtd = kotaTtdInput.trim();
        } else if (alamatPelanggan && alamatPelanggan !== '-') {
            const parts = alamatPelanggan.split(',');
            kotaTtd = parts[parts.length - 1].trim(); 
        } else {
            kotaTtd = namaTeldaInput.trim();
        }

        const kotaTtdFormatted = kotaTtd.charAt(0).toUpperCase() + kotaTtd.slice(1).toLowerCase();

        const inputTglVal = document.getElementById('tglSurat')?.value;
        let dateObj = inputTglVal ? new Date(inputTglVal) : new Date();

        if (isNaN(dateObj.getTime())) {
            dateObj = new Date();
        }

        const yearSurat = dateObj.getFullYear();
        const fullNoSurat = `${noSuratWmsInput.trim()}/${namaTelda}/${yearSurat}`;

        if (document.getElementById('prevFullNoSurat')) {
            document.getElementById('prevFullNoSurat').innerText = fullNoSurat;
        }

        if (document.getElementById('prevPelangganNama')) document.getElementById('prevPelangganNama').innerText = namaPelanggan;
        if (document.getElementById('prevPelangganNik')) document.getElementById('prevPelangganNik').innerText = nikPelanggan;
        if (document.getElementById('prevPelangganAlamat')) document.getElementById('prevPelangganAlamat').innerText = alamatPelanggan;
        if (document.getElementById('prevPelangganHp')) document.getElementById('prevPelangganHp').innerText = noHpPelanggan;
        if (document.getElementById('prevNoLayanan')) document.getElementById('prevNoLayanan').innerText = noLayanan;
        if (document.getElementById('prevPaketWms')) document.getElementById('prevPaketWms').innerText = paketWms;

        const elSign = document.getElementById('prevSignPelanggan');
        if (elSign) {
            elSign.innerText = (namaPelanggan !== '-' && namaPelanggan !== '') ? namaPelanggan : '....................................';
        }

        const tglFormatted = dateObj.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        if (document.getElementById('prevRealtimeDate')) {
            document.getElementById('prevRealtimeDate').innerText = `${kotaTtdFormatted}, ${tglFormatted}`;
        }

        // ==================================================================
        // PENYESUAIAN POSISI TANGGAL LEBIH ATAS & TAMBAH ENTER UNTUK MATERAI
        // ==================================================================
        const elPaper = document.getElementById('page1') || document.getElementById('letterPaper');
        if (elPaper) {
            elPaper.style.paddingTop = '10px';
            elPaper.style.paddingBottom = '10px';

            const listItems = elPaper.querySelectorAll('ol li, ul li');
            listItems.forEach(li => {
                li.style.marginBottom = '0px';
                li.style.lineHeight = '1.2';
            });

            // Container pembungkus utama blok TTD
            const elDate = document.getElementById('prevRealtimeDate');
            const signBlock = elDate?.parentElement || elSign?.closest('.signature-section') || elSign?.parentElement;

            if (signBlock && signBlock !== elPaper) {
                signBlock.style.marginTop = '-70px';
                signBlock.style.marginLeft = 'auto';
                signBlock.style.marginRight = '0';
                signBlock.style.width = '220px';
                signBlock.style.textAlign = 'center';
            }

            // TANGGAL
            if (elDate) {
                elDate.style.marginTop = '0px';
                elDate.style.marginBottom = '0px';
                elDate.style.textAlign = 'center';
                elDate.style.whiteSpace = 'nowrap';
            }

            // MATERAI
            const elMaterai = elPaper.querySelector('.materai-box') || (elSign ? elSign.closest('div')?.previousElementSibling : null);
            if (elMaterai) {
                elMaterai.style.marginTop = '75px';
                elMaterai.style.marginBottom = '8px';
                elMaterai.style.height = '45px';
                elMaterai.style.marginLeft = 'auto';
                elMaterai.style.marginRight = 'auto';
                elMaterai.style.display = 'flex';
                elMaterai.style.alignItems = 'center';
                elMaterai.style.justifyContent = 'center';
            }

            // NAMA PELANGGAN (Dikebawahin dengan marginTop 25px)
            if (elSign && elSign.parentElement) {
                elSign.parentElement.style.marginTop = '25px'; // Jarak ditambah agar turun ke bawah
                elSign.parentElement.style.marginBottom = '0px';
                elSign.parentElement.style.textAlign = 'center';
            }
        }

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
        console.error("Gagal memproses preview Surat WMS:", error);
        alert("Terjadi kesalahan saat membuat preview.");
    }
}

// ==========================================================================
// 3. DOWNLOAD PDF
// ==========================================================================
async function downloadPDF() {
    const btnDownload = document.getElementById('btnDownload');
    const element = document.getElementById('page1') || document.getElementById('letterPaper');
    const namaPelanggan = document.getElementById('namaPelanggan')?.value || 'Pelanggan';

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

        const originalTransform = element.style.transform;
        element.style.transform = 'none';

        const doc = new jsPDFLib({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const targetWidth = element.offsetWidth > 0 ? element.offsetWidth : 794;

        await doc.html(element, {
            callback: function (pdf) {
                element.style.transform = originalTransform;

                const totalPages = pdf.internal.getNumberOfPages();
                if (totalPages > 1) {
                    for (let i = totalPages; i > 1; i--) {
                        pdf.deletePage(i);
                    }
                }
                pdf.save(`Surat_Pernyataan_WMS_${namaPelanggan.replace(/\s+/g, '_')}.pdf`);
            },
            x: 0,
            y: 0,
            width: 210,
            windowWidth: targetWidth,
            autoPaging: 'text',
            html2canvas: {
                scale: 210 / targetWidth,
                useCORS: true,
                allowTaint: true,
                logging: false,
                scrollX: 0,
                scrollY: 0
            }
        });

    } catch (error) {
        console.error("Gagal mengunduh PDF WMS:", error);
        alert("Terjadi kesalahan saat membuat PDF: " + error.message);
    } finally {
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
    if (currentScale < 1.3) { 
        currentScale += 0.1; 
        applyZoom(); 
    } 
}

function zoomOut() { 
    if (currentScale > 0.5) { 
        currentScale -= 0.1; 
        applyZoom(); 
    } 
}

function applyZoom() {
    const page = document.getElementById('page1') || document.getElementById('letterPaper');
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