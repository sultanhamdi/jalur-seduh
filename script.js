function muatKatalog() {
    const wadah = document.getElementById('katalog-produk');
    if (!wadah) return;

    let htmlKatalog = '';
    for (const produk of dataJSON) {
        htmlKatalog += `
            <fieldset>
                <legend><strong>${produk.namaProduk}</strong></legend>
                <img src="${produk.urlGambar}" alt="${produk.namaProduk}" width="200">
                <p>Kategori: ${produk.kategori}</p>
                <p>Harga: Rp ${produk.harga.toLocaleString()}</p>
                <a href="detail.html?id=${produk.id}">Lihat Detail Produk</a>
            </fieldset>
            <br>
        `;
    }
    wadah.innerHTML = htmlKatalog;
}

function muatDetail() {
    const wadah = document.getElementById('detail-produk');
    if (!wadah) return;

    const urlParams = new URLSearchParams(window.location.search);
    const idProduk = urlParams.get('id');
    const produk = dataJSON.find(p => p.id === idProduk);

    wadah.innerHTML = `
        <h2>${produk.namaProduk}</h2>
        <img src="${produk.urlGambar}" alt="${produk.namaProduk}" width="300">
        <p><strong>Kategori:</strong> ${produk.kategori} - ${produk.subKategori}</p>
        <p><strong>Spesifikasi:</strong> ${produk.spesifikasi}</p>
        <p><strong>Berat/Kapasitas:</strong> ${produk.beratKapasitas}</p>
        <p><strong>Stok Tersedia:</strong> ${produk.stok}</p>
        <p><strong>Deskripsi:</strong> ${produk.deskripsi}</p>
        <h3>Harga: Rp ${produk.harga.toLocaleString()}</h3>
        <button type="button">Tambah ke Keranjang</button>
        `;
}

muatKatalog();
muatDetail();
