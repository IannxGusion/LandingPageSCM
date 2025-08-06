// ProdukPage.tsx
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
// NOTE: removed `Inertia` import and using `router` from @inertiajs/react

type Produk = {
  id: number;
  nama: string;
  harga: string;
  deskripsi: string;
  rating: number;
  kategori: string;
  gambar: string[]; // urut, jangan ubah
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'SCM', href: '/dashboard' },
  { title: 'Produk', href: '/produk' },
];

/* contoh produk — pastikan file ada di public/1.jpeg ... public/24.jpeg */
const produkList: Produk[] = [
  { id: 1, nama: 'Monitor LED 24 inch', harga: 'Rp 2.500.000', deskripsi: 'Tampilan jernih Full HD...', rating: 4, kategori: 'Elektronik', gambar: ['1.jpeg','2.jpeg','3.jpeg'] },
  { id: 2, nama: 'Printer LaserJet Pro', harga: 'Rp 1.800.000', deskripsi: 'Cepat dan hemat tinta...', rating: 5, kategori: 'Elektronik', gambar: ['4.jpeg','5.jpeg','6.jpeg'] },
  { id: 3, nama: 'Keyboard Mechanical RGB', harga: 'Rp 750.000', deskripsi: 'Sensasi mengetik menyenangkan...', rating: 4, kategori: 'Aksesoris', gambar: ['7.jpeg','8.jpeg','9.jpeg'] },
  { id: 4, nama: 'Kursi Ergonomis Kantor', harga: 'Rp 1.200.000', deskripsi: 'Nyaman digunakan seharian...', rating: 5, kategori: 'Furniture', gambar: ['10.jpeg','11.jpeg','12.jpeg'] },
  { id: 5, nama: 'Mouse Wireless Precision', harga: 'Rp 350.000', deskripsi: 'Akurasi tinggi dengan desain ergonomis...', rating: 4, kategori: 'Aksesoris', gambar: ['13.jpeg','14.jpeg','15.jpeg'] },
  { id: 6, nama: 'Headset Gaming Stereo', harga: 'Rp 420.000', deskripsi: 'Suara jernih, mikrofon noise-cancelling...', rating: 4, kategori: 'Elektronik', gambar: ['16.jpeg','17.jpeg','18.jpeg'] },
  { id: 7, nama: 'SSD NVMe 1TB', harga: 'Rp 1.400.000', deskripsi: 'Kecepatan baca tulis tinggi...', rating: 5, kategori: 'Elektronik', gambar: ['19.jpeg','20.jpeg','21.jpeg'] },
  { id: 8, nama: 'Rak Serbaguna Kayu', harga: 'Rp 650.000', deskripsi: 'Desain minimalis, cocok untuk kantor...', rating: 4, kategori: 'Furniture', gambar: ['22.jpeg','23.jpeg','24.jpeg'] },
];

const kategoriList = ['Semua', 'Elektronik', 'Aksesoris', 'Furniture'];

/* fallback image simple data-uri */
const fallbackImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="%23E5E7EB"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239CA3AF" font-size="20" font-family="Arial,Helvetica,sans-serif">Image not available</text></svg>';

const gridVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.995 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

function readCart(): any[] {
  try {
    const raw = localStorage.getItem('scm_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items: any[]) {
  localStorage.setItem('scm_cart', JSON.stringify(items));
}

export default function ProdukPage() {
  const [kategori, setKategori] = useState<string>('Semua');
  const [search, setSearch] = useState<string>('');
  const [selected, setSelected] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [qty, setQty] = useState<number>(1);

  const selectedProduct = produkList.find((p) => p.id === selected) ?? null;

  const filteredProduk = produkList.filter((produk) => {
    const cocokKategori = kategori === 'Semua' || produk.kategori === kategori;
    const cocokNama = produk.nama.toLowerCase().includes(search.toLowerCase());
    return cocokKategori && cocokNama;
  });

  useEffect(() => {
    if (!isModalOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') return closeModal();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModalOpen]);

  function openModal(id: number) {
    setSelected(id);
    setActiveImageIndex(0);
    setQty(1);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    setSelected(null);
    setActiveImageIndex(0);
    setIsModalOpen(false);
    document.body.style.overflow = '';
  }

  function onImgError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const img = e.currentTarget;
    img.onerror = null;
    img.src = fallbackImage;
  }

  function prevImage() {
    if (!selectedProduct) return;
    setActiveImageIndex((i) => (i <= 0 ? selectedProduct.gambar.length - 1 : i - 1));
  }
  function nextImage() {
    if (!selectedProduct) return;
    setActiveImageIndex((i) => (i >= selectedProduct.gambar.length - 1 ? 0 : i + 1));
  }
  function goToImage(index: number) {
    if (!selectedProduct) return;
    setActiveImageIndex(Math.max(0, Math.min(index, selectedProduct.gambar.length - 1)));
  }

  function addToCartAndGoToCart(prod: Produk, quantity: number) {
    // update local cart
    const cart = readCart();
    const existing = cart.find(it => it.id === prod.id);
    if (existing) {
      existing.qty = Math.min((existing.qty || 0) + quantity, 999);
    } else {
      cart.push({
        id: prod.id,
        nama: prod.nama,
        hargaText: prod.harga,
        hargaInt: parseInt(String(prod.harga).replace(/[^0-9]/g, '')) || 0,
        qty: quantity,
        gambar: prod.gambar[0] ?? '1.jpeg',
      });
    }
    writeCart(cart);

    // close modal first
    closeModal();

    // then navigate using Inertia router (react)
    // router.visit will request the server route /keranjang
    router.visit('/keranjang');
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Daftar Produk SCM" />
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-4xl font-bold tracking-tight">Produk SCM</h1>
          <p className="mt-2 text-white/90 text-lg max-w-xl">Klik produk untuk melihat detail dan galeri foto lengkap.</p>
        </motion.div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            {kategoriList.map((kat) => (
              <button key={kat} onClick={() => setKategori(kat)} className={`px-4 py-2 rounded-full border transition ${kategori === kat ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white border-neutral-300 dark:border-neutral-700'}`}>
                {kat}
              </button>
            ))}
          </div>

          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari produk..." className="border rounded-lg px-4 py-2 w-full md:w-64 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white" />
        </div>

        {/* Grid */}
        <motion.div variants={gridVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProduk.map((produk) => (
            <motion.div key={produk.id} variants={cardVariants} whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} className="relative group bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden">
              <div className="relative cursor-pointer" onClick={() => openModal(produk.id)} role="button" aria-label={`Lihat ${produk.nama}`}>
                <motion.img src={produk.gambar[0]} alt={produk.nama} initial={{ scale: 1 }} whileHover={{ scale: 1.06 }} transition={{ duration: 0.4 }} className="w-full h-40 object-cover" loading="lazy" decoding="async" onError={onImgError} />
                {/* overlay removed as requested (no Lihat / Keranjang buttons) */}
              </div>

              <div className="p-4 cursor-pointer" onClick={() => openModal(produk.id)}>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">{produk.nama}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">{produk.deskripsi}</p>

                <div className="flex items-center justify-between mt-3">
                  <div>
                    <div className="font-semibold text-indigo-600 dark:text-indigo-400">{produk.harga}</div>
                    <div className="text-xs text-neutral-500">{produk.kategori}</div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={i < produk.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300'} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredProduk.length === 0 && <p className="text-center text-neutral-500 dark:text-neutral-400">Produk tidak ditemukan.</p>}

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={closeModal} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.28 }} className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-[96%] md:w-5/6 lg:w-4/6" role="dialog" aria-modal="true">
                <div className="flex items-start justify-between px-5 py-4 border-b dark:border-neutral-800">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedProduct.nama}</h3>
                    <div className="text-xs text-neutral-500">{selectedProduct.kategori} • {selectedProduct.rating}★</div>
                  </div>
                  <button onClick={closeModal} aria-label="Tutup" className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5">
                  <div className="md:col-span-7 relative">
                    <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 dark:bg-neutral-800/60 hover:scale-105 transition" aria-label="Sebelumnya">
                      <ChevronLeft />
                    </button>

                    <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 dark:bg-neutral-800/60 hover:scale-105 transition" aria-label="Selanjutnya">
                      <ChevronRight />
                    </button>

                    <div className="rounded-xl overflow-hidden relative">
                      <motion.img key={selectedProduct.gambar[activeImageIndex]} src={selectedProduct.gambar[activeImageIndex]} alt={`${selectedProduct.nama} - ${activeImageIndex + 1}`} initial={{ opacity: 0, scale: 0.995 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }} className="w-full h-[420px] md:h-[520px] object-cover" onClick={(e) => e.stopPropagation()} loading="lazy" decoding="async" onError={onImgError} />
                      <div className="absolute left-4 bottom-4 bg-black/40 text-white text-xs px-2 py-1 rounded-md">Gambar {activeImageIndex + 1} / {selectedProduct.gambar.length}</div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 overflow-x-auto py-2">
                      {selectedProduct.gambar.map((img, idx) => (
                        <button key={img + idx} onClick={(e) => { e.stopPropagation(); goToImage(idx); }} className={`flex-shrink-0 rounded-lg overflow-hidden border ${idx === activeImageIndex ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-neutral-200 dark:border-neutral-700'}`}>
                          <img src={img} alt={`thumb-${idx}`} className="w-24 h-16 object-cover" loading="lazy" decoding="async" onError={onImgError} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-5 flex flex-col gap-4">
                    <div className="text-2xl font-bold text-indigo-600">{selectedProduct.harga}</div>

                    <div className="text-sm text-neutral-600 dark:text-neutral-300">
                      <h4 className="font-semibold mb-2">Deskripsi</h4>
                      <p>{selectedProduct.deskripsi}</p>
                    </div>

                    {/* Quantity + Add to cart */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2">-</button>
                        <div className="px-4 py-2 min-w-[48px] text-center">{qty}</div>
                        <button onClick={() => setQty((q) => Math.min(999, q + 1))} className="px-3 py-2">+</button>
                      </div>

                      <button onClick={() => addToCartAndGoToCart(selectedProduct, qty)} className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition">
                        Tambah ke Keranjang & Checkout
                      </button>
                    </div>

                    <div className="pt-2">
                      <h5 className="font-semibold mb-2">Spesifikasi singkat</h5>
                      <ul className="text-sm text-neutral-600 dark:text-neutral-400 list-disc pl-5 space-y-1">
                        <li>Kategori: {selectedProduct.kategori}</li>
                        <li>Rating: {selectedProduct.rating} dari 5</li>
                        <li>Garansi: 1 tahun (standar)</li>
                        <li>Ketersediaan: Ready stock</li>
                      </ul>
                    </div>

                    <div className="mt-auto text-xs text-neutral-400">Gambar: gunakan file di <code>/public/</code> (1.jpeg ... 24.jpeg).</div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
