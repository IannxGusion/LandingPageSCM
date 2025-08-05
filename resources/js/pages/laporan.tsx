import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import { Truck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'SCM', href: '/dashboard' },
  { title: 'Laporan Pengiriman', href: '/pengiriman/laporan' },
];

const dataPengiriman = [
  {
    nama: 'Budi Santoso',
    tanggal: '2025-08-05',
    total: 'Rp1.250.000',
    kontak: '081234567890',
    lokasi: 'Jakarta',
    status: 'Dikirim',
  },
  {
    nama: 'Siti Aminah',
    tanggal: '2025-08-04',
    total: 'Rp850.000',
    kontak: '082212345678',
    lokasi: 'Bandung',
    status: 'Diterima',
  },
  {
    nama: 'Andi Pratama',
    tanggal: '2025-08-03',
    total: 'Rp1.700.000',
    kontak: '085612345432',
    lokasi: 'Surabaya',
    status: 'Dibatalkan',
  },
  {
    nama: 'Dewi Rahma',
    tanggal: '2025-08-02',
    total: 'Rp1.050.000',
    kontak: '081298765432',
    lokasi: 'Makassar',
    status: 'Dikirim',
  },
];

export default function LaporanPengiriman() {
  const [search, setSearch] = useState('');

  const filteredData = dataPengiriman.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Laporan Pengiriman" />
      <style>{`
        @media print {
          input, .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="p-6 space-y-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 space-y-6">
          {/* Judul dan Filter */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold flex items-center gap-3 text-blue-700 dark:text-blue-400">
              <Truck size={30} /> Laporan Pengiriman
            </h1>
            <input
              type="text"
              placeholder="🔍 Cari nama atau lokasi..."
              className="px-4 py-2 border rounded-md w-full md:w-64 dark:bg-neutral-900 dark:text-white dark:border-neutral-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Tabel Laporan */}
          <div className="overflow-x-auto rounded-lg border dark:border-neutral-700">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white font-semibold">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Kontak</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-neutral-700">
                {filteredData.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{item.nama}</td>
                    <td className="px-4 py-2">{item.tanggal}</td>
                    <td className="px-4 py-2">{item.total}</td>
                    <td className="px-4 py-2">{item.kontak}</td>
                    <td className="px-4 py-2">{item.lokasi}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Dikirim'
                            ? 'bg-yellow-100 text-yellow-800'
                            : item.status === 'Diterima'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length === 0 && (
              <p className="text-center text-sm p-4 text-neutral-600 dark:text-neutral-300">
                Tidak ada data laporan pengiriman.
              </p>
            )}
          </div>

          {/* Tombol Print */}
          <div className="text-right no-print">
            <button
              onClick={() => window.print()}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
            >
              Cetak Laporan
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
