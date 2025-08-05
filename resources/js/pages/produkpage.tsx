import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'SCM', href: '/dashboard' },
  { title: 'Produk', href: '/produk' },
];

const produkList = [
  {
    nama: 'Monitor LED 24 inch',
    harga: 'Rp 2.500.000',
    deskripsi: 'Tampilan jernih Full HD, cocok untuk kebutuhan kantor atau gaming.',
    rating: 4,
    kategori: 'Elektronik',
    gambar: 'https://source.unsplash.com/featured/?monitor',
  },
  {
    nama: 'Printer LaserJet Pro',
    harga: 'Rp 1.800.000',
    deskripsi: 'Cepat dan hemat tinta, ideal untuk bisnis kecil hingga menengah.',
    rating: 5,
    kategori: 'Elektronik',
    gambar: 'https://source.unsplash.com/featured/?printer',
  },
  {
    nama: 'Keyboard Mechanical RGB',
    harga: 'Rp 750.000',
    deskripsi: 'Sensasi mengetik menyenangkan dengan pencahayaan warna-warni.',
    rating: 4,
    kategori: 'Aksesoris',
    gambar: 'https://source.unsplash.com/featured/?keyboard',
  },
  {
    nama: 'Kursi Ergonomis Kantor',
    harga: 'Rp 1.200.000',
    deskripsi: 'Nyaman digunakan seharian, mendukung postur tubuh yang sehat.',
    rating: 5,
    kategori: 'Furniture',
    gambar: 'https://source.unsplash.com/featured/?office-chair',
  },
];

const kategoriList = ['Semua', 'Elektronik', 'Aksesoris', 'Furniture'];

export default function ProdukPage() {
  const [kategori, setKategori] = useState('Semua');
  const [search, setSearch] = useState('');

  const filteredProduk = produkList.filter((produk) => {
    const cocokKategori = kategori === 'Semua' || produk.kategori === kategori;
    const cocokNama = produk.nama.toLowerCase().includes(search.toLowerCase());
    return cocokKategori && cocokNama;
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Daftar Produk SCM" />
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-8 shadow-xl"
        >
          <h1 className="text-4xl font-bold tracking-tight">Produk SCM</h1>
          <p className="mt-2 text-white/90 text-lg max-w-xl">
            Temukan berbagai produk terbaik untuk kebutuhan bisnis Anda.
          </p>
        </motion.div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            {kategoriList.map((kat) => (
              <button
                key={kat}
                onClick={() => setKategori(kat)}
                className={`px-4 py-2 rounded-full border ${
                  kategori === kat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white border-neutral-300 dark:border-neutral-700'
                } transition`}
              >
                {kat}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full md:w-64 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
          />
        </div>

        {/* Produk Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProduk.map((produk, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden"
            >
              <img
                src={produk.gambar}
                alt={produk.nama}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-1">
                <h3 className="text-xl font-bold text-neutral-800 dark:text-white">{produk.nama}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{produk.deskripsi}</p>
                <p className="font-semibold text-indigo-600 dark:text-indigo-400">{produk.harga}</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < produk.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-400'
                      }
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProduk.length === 0 && (
          <p className="text-center text-neutral-500 dark:text-neutral-400">Produk tidak ditemukan.</p>
        )}
      </div>
    </AppLayout>
  );
}
