import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { motion } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';

// Komentar dummy
const komentarData: Record<number, string[]> = {
  1: ['Bagus banget!', 'Sangat memuaskan!'],
  2: ['Cetaknya cepat dan hemat tinta.'],
  3: ['Tombolnya enak banget dipake.'],
  4: ['Empuk dan nyaman seharian duduk.'],
  5: ['Nyaman di tangan dan responsif.'],
  6: ['Suaranya jernih, cocok buat gaming.'],
  7: ['Ngebut banget buat buka aplikasi.'],
  8: ['Raknya kokoh dan rapi.'],
};

type Produk = {
  id: number;
  nama: string;
  harga: string;
  deskripsi: string;
  rating: number;
  kategori: string;
  gambar: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'SCM', href: '/dashboard' },
  { title: 'Produk', href: '/produk' },
];

const produkList: Produk[] = [
  { id: 1, nama: 'Monitor LED 24 inch', harga: 'Rp 2.500.000', deskripsi: 'Tampilan jernih Full HD...', rating: 4, kategori: 'Elektronik', gambar: ['1.jpeg'] },
  { id: 2, nama: 'Printer LaserJet Pro', harga: 'Rp 1.800.000', deskripsi: 'Cepat dan hemat tinta...', rating: 5, kategori: 'Elektronik', gambar: ['4.jpeg'] },
  { id: 3, nama: 'Keyboard Mechanical RGB', harga: 'Rp 750.000', deskripsi: 'Sensasi mengetik menyenangkan...', rating: 4, kategori: 'Aksesoris', gambar: ['7.jpeg'] },
  { id: 4, nama: 'Kursi Ergonomis Kantor', harga: 'Rp 1.200.000', deskripsi: 'Nyaman digunakan seharian...', rating: 5, kategori: 'Furniture', gambar: ['10.jpeg'] },
  { id: 5, nama: 'Mouse Wireless Precision', harga: 'Rp 350.000', deskripsi: 'Akurasi tinggi dengan desain ergonomis...', rating: 4, kategori: 'Aksesoris', gambar: ['13.jpeg'] },
  { id: 6, nama: 'Headset Gaming Stereo', harga: 'Rp 420.000', deskripsi: 'Suara jernih, mikrofon noise-cancelling...', rating: 4, kategori: 'Elektronik', gambar: ['16.jpeg'] },
  { id: 7, nama: 'SSD NVMe 1TB', harga: 'Rp 1.400.000', deskripsi: 'Kecepatan baca tulis tinggi...', rating: 5, kategori: 'Elektronik', gambar: ['19.jpeg'] },
  { id: 8, nama: 'Rak Serbaguna Kayu', harga: 'Rp 650.000', deskripsi: 'Desain minimalis, cocok untuk kantor...', rating: 4, kategori: 'Furniture', gambar: ['22.jpeg'] },
];

const kategoriList = ['Semua', 'Elektronik', 'Aksesoris', 'Furniture'];

const fallbackImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="%23E5E7EB"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239CA3AF" font-size="20" font-family="Arial,Helvetica,sans-serif">Image not available</text></svg>';

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
  const [komentarPopup, setKomentarPopup] = useState<{ open: boolean; produkId: number | null }>({ open: false, produkId: null });

  const filteredProduk = produkList.filter((produk) => {
    const cocokKategori = kategori === 'Semua' || produk.kategori === kategori;
    const cocokNama = produk.nama.toLowerCase().includes(search.toLowerCase());
    return cocokKategori && cocokNama;
  });

  function onImgError(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    img.onerror = null;
    img.src = fallbackImage;
  }

  function addToCart(prod: Produk) {
    const cart = readCart();
    const existing = cart.find(it => it.id === prod.id);
    if (existing) {
      existing.qty = Math.min((existing.qty || 0) + 1, 999);
    } else {
      cart.push({
        id: prod.id,
        nama: prod.nama,
        hargaText: prod.harga,
        hargaInt: parseInt(prod.harga.replace(/[^0-9]/g, '')) || 0,
        qty: 1,
        gambar: prod.gambar[0],
      });
    }
    writeCart(cart);
    router.visit('/keranjang');
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Produk SCM" />
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-8 shadow-xl"
        >
          <h1 className="text-4xl font-bold">Produk SCM</h1>
          <p className="text-white/90 text-lg mt-2 max-w-xl">Klik tombol untuk langsung tambahkan ke keranjang.</p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            {kategoriList.map((kat) => (
              <button
                key={kat}
                onClick={() => setKategori(kat)}
                className={`px-4 py-2 rounded-full border transition ${
                  kategori === kat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white border-neutral-300 dark:border-neutral-700'
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="border rounded-lg px-4 py-2 w-full md:w-64 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
          />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProduk.map((produk) => (
            <motion.div
              key={produk.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={produk.gambar[0]}
                alt={produk.nama}
                className="w-full h-48 object-cover"
                onError={onImgError}
                loading="lazy"
              />
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">{produk.nama}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">{produk.deskripsi}</p>
                <div className="text-indigo-600 dark:text-indigo-400 font-bold">{produk.harga}</div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 dark:text-neutral-400">{produk.kategori}</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < produk.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300'}
                      />
                    ))}
                  </div>
                </div>

                <ul className="text-xs text-neutral-500 dark:text-neutral-400 list-disc pl-4">
                  <li>Garansi: 1 tahun</li>
                  <li>Ketersediaan: Ready stock</li>
                </ul>

                <button
                  onClick={() => addToCart(produk)}
                  className="mt-3 w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  Tambah ke Keranjang
                </button>

                <button
                  onClick={() => setKomentarPopup({ open: true, produkId: produk.id })}
                  className="mt-2 w-full px-4 py-2 rounded-lg border text-sm flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700"
                >
                  <MessageSquare size={16} /> Lihat Komentar
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredProduk.length === 0 && (
          <p className="text-center text-neutral-500 dark:text-neutral-400">Produk tidak ditemukan.</p>
        )}
      </div>

      <Dialog open={komentarPopup.open} onClose={() => setKomentarPopup({ open: false, produkId: null })} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
            <Dialog.Title className="text-lg font-semibold mb-2 text-neutral-800 dark:text-white">Komentar Produk</Dialog.Title>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300 max-h-64 overflow-y-auto">
              {(komentarPopup.produkId && komentarData[komentarPopup.produkId]) ? (
                komentarData[komentarPopup.produkId].map((kom, i) => (
                  <li key={i} className="bg-neutral-100 dark:bg-neutral-700 p-2 rounded-md">{kom}</li>
                ))
              ) : (
                <li className="text-neutral-400">Belum ada komentar.</li>
              )}
            </ul>
            <div className="mt-4 text-right">
              <button
                onClick={() => setKomentarPopup({ open: false, produkId: null })}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Tutup
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </AppLayout>
  );
}
