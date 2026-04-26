function muatKatalog() {
    const wadah = document.getElementById('katalog-produk');
    if (!wadah) return;

    const inputCari = document.getElementById('input-cari');
    const selectKategori = document.getElementById('filter-kategori');
    const selectSort = document.getElementById('sort-produk');

    const headerPencarian = document.getElementById('hasil-pencarian-header');
    const judulUtama = document.getElementById('judul-katalog-utama');

    let kataKunci = inputCari.value.toLowerCase();
    let kategori = selectKategori.value;
    let urutan = selectSort.value;

    let sedangMencari = false;
    if (kataKunci !== "" || kategori !== "Semua") {
        sedangMencari = true;
    }

    if (headerPencarian && judulUtama) {
        if (sedangMencari) {
            headerPencarian.style.display = 'block';
            judulUtama.style.display = 'none';
        } else {
            headerPencarian.style.display = 'none';
            judulUtama.style.display = 'block';
        }
    }

    // 1. FILTERING
    let hasil = dataJSON.filter(produk => {
        let nama = produk.namaProduk.toLowerCase();
        let desk = produk.deskripsi.toLowerCase();

        let cocokKategori = false;
        if (kategori === "Semua" || produk.kategori === kategori) {
            cocokKategori = true;
        }

        let cocokTeks = false;
        if (kataKunci === "" || nama.includes(kataKunci) || desk.includes(kataKunci)) {
            cocokTeks = true;
        }

        return cocokKategori && cocokTeks;
    });

    // 2. SORTING
    if (urutan === 'harga-asc') {
        hasil.sort((a, b) => a.harga - b.harga);
    } else if (urutan === 'harga-desc') {
        hasil.sort((a, b) => b.harga - a.harga);
    } else if (urutan === 'nama-asc') {
        hasil.sort((a, b) => a.namaProduk.localeCompare(b.namaProduk));
    }

    // 3. RENDERING
    let htmlKatalog = '';

    if (hasil.length === 0) {
        htmlKatalog = `<div style="text-align: center; padding: 50px;">-- Maaf, produk tidak ditemukan --</div>`;
    } else {
        for (const produk of hasil) {
            let kemiringan = (produk.namaProduk.length % 5) - 2;

            htmlKatalog += `
                <a href="detail.html?id=${produk.id}" class="kartu-katalog" style="transform: rotate(${kemiringan}deg)">
                    <div class="photo-container">
                        <img src="${produk.urlGambar}" alt="${produk.namaProduk}">
                    </div>
                    <div class="photo-caption">
                        <h3>${produk.namaProduk}</h3>
                        <p class="harga">IDR ${produk.harga.toLocaleString()}</p>
                    </div>
                </a>
            `;
        }
    }

    wadah.innerHTML = htmlKatalog;
}

// Event Listeners Pencarian
const inputCari = document.getElementById('input-cari');
const selectKategori = document.getElementById('filter-kategori');
const btnCari = document.getElementById('btn-cari');

if (inputCari) {
    inputCari.onkeypress = function (e) {
        if (e.key === 'Enter') {
            muatKatalog();
        }
    };
}

if (selectKategori) {
    selectKategori.onchange = muatKatalog;
}

if (btnCari) {
    btnCari.onclick = muatKatalog;
}

function muatDetail() {
    const wadah = document.getElementById('detail-produk');
    if (!wadah) return;

    const urlParams = new URLSearchParams(window.location.search);
    const idProduk = urlParams.get('id');
    const produk = dataJSON.find(p => p.id === idProduk);

    wadah.innerHTML = `
        <div class="detail-container">
            <div class="detail-image-wrapper">
                <img src="${produk.urlGambar}" alt="${produk.namaProduk}">
            </div>
            <div class="detail-info">
                <h2>${produk.namaProduk}</h2>
                <div class="archive-specs">
                    <p><strong>Kategori:</strong> ${produk.kategori} &mdash; ${produk.subKategori}</p>
                    <p><strong>Asal / Merk:</strong> ${produk.asalMerk}</p>
                    <p><strong>Spesifikasi:</strong> ${produk.spesifikasi}</p>
                    <p><strong>Berat/Kapasitas:</strong> ${produk.beratKapasitas}</p>
                    <p><strong>Stok Tersedia:</strong> ${produk.stok} Unit</p>
                    <hr class="dashed-line">
                    <p><strong>Catatan Arsip:</strong> ${produk.deskripsi}</p>
                </div>
                <h3 class="detail-price">IDR ${produk.harga.toLocaleString()}</h3>
                
                <div class="qty-wrapper">
                    <span>JUMLAH:</span>
                    <button type="button" class="qty-btn" id="btn-min">-</button>
                    <input type="text" value="1" readonly class="qty-input" id="input-qty">
                    <button type="button" class="qty-btn" id="btn-plus">+</button>
                </div>

                <button type="button" class="add-to-cart" id="btn-add-cart">SIMPAN KE TROLI</button>
            </div>
        </div>
    `;

    // Logika Tombol Kuantitas
    const btnMin = document.getElementById('btn-min');
    const btnPlus = document.getElementById('btn-plus');
    const inputQty = document.getElementById('input-qty');

    btnPlus.onclick = function () {
        let current = parseInt(inputQty.value);
        if (current < produk.stok) {
            inputQty.value = current + 1;
        } else {
            alert('Maaf, stok tidak mencukupi.');
        }
    };

    btnMin.onclick = function () {
        let current = parseInt(inputQty.value);
        if (current > 1) {
            inputQty.value = current - 1;
        }
    };

    // EVENT KLIK TAMBAH KE KERANJANG
    const btnAdd = document.getElementById('btn-add-cart');
    btnAdd.onclick = function () {
        tambahKeKeranjang(idProduk, inputQty.value);
    };
}

// FUNGSI SISTEM TROLI
function tambahKeKeranjang(idProduk, jumlah) {
    let keranjangData = localStorage.getItem('troli');
    let keranjang = [];

    if (keranjangData) {
        keranjang = JSON.parse(keranjangData);
    }

    let qtyBaru = parseInt(jumlah);
    let barangSudahAda = false;

    for (let i = 0; i < keranjang.length; i++) {
        if (keranjang[i].id === idProduk) {
            keranjang[i].qty = keranjang[i].qty + qtyBaru;
            barangSudahAda = true;
            break;
        }
    }

    if (barangSudahAda === false) {
        keranjang.push({
            id: idProduk,
            qty: qtyBaru,
            selected: true
        });
    }

    localStorage.setItem('troli', JSON.stringify(keranjang));
    window.alert("Barang telah ditambahkan");

    updateIconKeranjang();
}

function updateIconKeranjang() {
    let keranjangData = localStorage.getItem('troli');
    let keranjang = [];

    if (keranjangData) {
        keranjang = JSON.parse(keranjangData);
    }

    let totalBarang = 0;
    for (let i = 0; i < keranjang.length; i++) {
        totalBarang = totalBarang + keranjang[i].qty;
    }

    let badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerHTML = totalBarang;
    }
}

function muatTroli() {
    let wadah = document.getElementById('daftar-troli');
    let containerPilihSemua = document.getElementById('pilih-semua-container');

    if (!wadah) return;

    let dataLokal = localStorage.getItem('troli');
    let keranjang = [];
    if (dataLokal) {
        keranjang = JSON.parse(dataLokal);
    }

    if (keranjang.length === 0) {
        document.getElementById('troli-kosong').style.display = 'block';
        document.getElementById('troli-footer').style.display = 'none';
        if (containerPilihSemua) {
            containerPilihSemua.style.display = 'none';
        }
        wadah.innerHTML = '';
        return;
    }

    if (containerPilihSemua) {
        containerPilihSemua.style.display = 'block';
    }

    let htmlTroli = '';

    for (let i = 0; i < keranjang.length; i++) {
        let item = keranjang[i];

        let produk = dataJSON.find(p => p.id === item.id);

        let statusCentang = '';
        if (item.selected !== false) {
            statusCentang = 'checked';
        }

        htmlTroli += `
            <div class="troli-item" data-id="${item.id}" data-harga="${produk.harga}" data-qty="${item.qty}">
                <input type="checkbox" class="cart-checkbox" onchange="hitungTotal()" ${statusCentang}>
                <img src="${produk.urlGambar}" alt="${produk.namaProduk}">
                <div class="troli-item-info">
                    <div class="troli-head">
                        <h3><a href="detail.html?id=${item.id}">${produk.namaProduk}</a></h3>
                        <p class="troli-harga">IDR ${produk.harga.toLocaleString()}</p>
                    </div>
                    <div class="troli-actions">
                        <button onclick="hapusItem('${item.id}')" class="delete-btn">🗑️</button>
                        <div class="qty-wrapper">
                            <button type="button" class="qty-btn" onclick="ubahQtyTroli('${item.id}', -1)">-</button>
                            <input type="text" value="${item.qty}" readonly class="qty-input">
                            <button type="button" class="qty-btn" onclick="ubahQtyTroli('${item.id}', 1)">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    wadah.innerHTML = htmlTroli;
    hitungTotal();
}

function ubahQtyTroli(id, delta) {
    let dataLokal = localStorage.getItem('troli');
    let keranjang = [];
    if (dataLokal) {
        keranjang = JSON.parse(dataLokal);
    }

    let produk = dataJSON.find(p => p.id === id);

    for (let j = 0; j < keranjang.length; j++) {
        if (keranjang[j].id === id) {
            let newQty = keranjang[j].qty + delta;

            if (newQty >= 1 && newQty <= produk.stok) {
                keranjang[j].qty = newQty;
                localStorage.setItem('troli', JSON.stringify(keranjang));
                muatTroli();
                updateIconKeranjang();
            } else if (newQty > produk.stok) {
                alert('Maaf, stok tidak mencukupi.');
            }
            break;
        }
    }
}

function togglePilihSemua(source) {
    let checkboxes = document.getElementsByClassName('cart-checkbox');

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = source.checked;
    }
    hitungTotal();
}

function hitungTotal() {
    let items = document.getElementsByClassName('troli-item');
    let checkAll = document.getElementById('check-all');

    let dataLokal = localStorage.getItem('troli');
    let keranjang = [];
    if (dataLokal) {
        keranjang = JSON.parse(dataLokal);
    }

    let totalHarga = 0;
    let adaYangDiceklis = false;
    let semuaDiceklis = true;

    if (items.length === 0) {
        semuaDiceklis = false;
    }

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let id = item.getAttribute('data-id');

        let checkbox = item.getElementsByClassName('cart-checkbox')[0];

        let itemData = keranjang.find(k => k.id === id);

        if (itemData) {
            itemData.selected = checkbox.checked;
        }

        if (checkbox.checked === true) {
            let harga = parseInt(item.getAttribute('data-harga'));
            let qty = parseInt(item.getAttribute('data-qty'));
            totalHarga = totalHarga + (harga * qty);
            adaYangDiceklis = true;
        } else {
            semuaDiceklis = false;
        }
    }

    localStorage.setItem('troli', JSON.stringify(keranjang));

    if (checkAll) {
        checkAll.checked = semuaDiceklis;
    }

    document.getElementById('total-harga-troli').innerHTML = "Total: IDR " + totalHarga.toLocaleString();

    let btnBayar = document.getElementById('btn-bayar');
    if (btnBayar) {
        if (adaYangDiceklis === true) {
            btnBayar.disabled = false;
            btnBayar.style.opacity = '1';
            btnBayar.style.cursor = 'pointer';
        } else {
            btnBayar.disabled = true;
            btnBayar.style.opacity = '0.5';
            btnBayar.style.cursor = 'not-allowed';
        }
    }
}

function hapusItem(id) {
    let dataLokal = localStorage.getItem('troli');
    let keranjang = [];
    if (dataLokal) {
        keranjang = JSON.parse(dataLokal);
    }

    let keranjangBaru = keranjang.filter(function (item) {
        return item.id !== id;
    });

    localStorage.setItem('troli', JSON.stringify(keranjangBaru));
    muatTroli();
    updateIconKeranjang();
}

updateIconKeranjang();
muatKatalog();
muatDetail();