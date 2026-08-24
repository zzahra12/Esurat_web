// Logika saat tombol Pilih diklik
function selectLetter(letterType) {
    // 1. Simpan jenis surat yang dipilih ke localStorage
    localStorage.setItem('selectedLetterType', letterType);

    // 2. Tampilkan submenu di sidebar
    const submenu = document.getElementById('suratSubmenu');
    if (submenu) {
        submenu.style.display = 'flex';
        
        // Hapus class active dari semua item
        document.querySelectorAll('.submenu-item').forEach(item => {
            item.classList.remove('active');
        });

        // Tambahkan class active pada item yang dipilih
        const activeItem = document.querySelector(`.submenu-item[onclick*="${letterType}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    // 3. Pindah ke halaman form surat setelah delay singkat (agar efek aktif terlihat)
    setTimeout(() => {
        window.location.href = 'buka-isolir.html'; // Sesuaikan file tujuan form
    }, 300);
}

// Saat halaman baru pertama kali dimuat, pastikan sidebar bersih (reset pilihan)
document.addEventListener('DOMContentLoaded', () => {
    // Kosongkan cache pilihan lama jika ingin sidebar selalu bersih saat pertama masuk ke dashboard
    localStorage.removeItem('selectedLetterType');
    
    const submenu = document.getElementById('suratSubmenu');
    if (submenu) {
        submenu.style.display = 'none'; // Sembunyikan submenu secara default
    }
});