// File: LaporanPage.tsx

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'SCM', href: '/dashboard' },
  { title: 'Laporan', href: '/pengiriman' },
];

export type CartItem = {
  id: number;
  nama: string;
  hargaText: string;
  hargaInt: number;
  qty: number;
  gambar?: string;
};

export type Order = {
  id: string;
  namaPembeli: string;
  tanggal: string;
  totalText: string;
  totalInt: number;
  kontak: string;
  lokasi: string;
  status: string;
  items: CartItem[];
};

function formatRp(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function ensureImgPath(path?: string): string {
  if (!path) return '/1.jpeg';
  return path.startsWith('/') ? path : `/${path}`;
}

export default function LaporanPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editOrder, setEditOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('scm_orders');
      if (raw) setOrders(JSON.parse(raw));
    } catch (err) {
      console.error('Gagal memuat orders dari localStorage', err);
    }
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm('Yakin ingin menghapus laporan ini?')) return;
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    localStorage.setItem('scm_orders', JSON.stringify(updated));
  };

  const handlePrint = () => window.print();

  const handleEditClick = (order: Order) => {
    setEditOrder(order);
  };

  const handleSaveEdit = () => {
    if (!editOrder) return;
    const updated = orders.map(o => (o.id === editOrder.id ? editOrder : o));
    setOrders(updated);
    localStorage.setItem('scm_orders', JSON.stringify(updated));
    setEditOrder(null);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Laporan Pengiriman - SCM" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-8 shadow-xl"
      >
        <h1 className="text-4xl font-bold tracking-tight">Laporan Customer</h1>
        <p className="mt-2 text-white/90 text-lg max-w-xl">
          Informasi Laporan dan Pengeditan Serta Penghapusan
        </p>
      </motion.div>

      {/* Tombol Cetak */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow"
          >
            Cetak Laporan
          </button>
        </div>

        {/* Daftar Order */}
        {orders.length === 0 ? (
          <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg text-center text-neutral-500">
            Belum ada pesanan yang dilakukan.
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map(order => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                  className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border dark:border-neutral-700 print:border print:shadow-none"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-lg text-blue-800 dark:text-blue-400">{order.namaPembeli}</div>
                      <div className="text-sm text-neutral-500">
                        {order.kontak} &bull; {order.lokasi}
                      </div>
                      <div className="text-xs text-neutral-400 mt-1 italic">
                        Status:{' '}
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full font-medium text-xs ${
                            order.status === 'Dikirim'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'Diterima'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-neutral-500">{order.tanggal}</div>
                      <div className="text-sm font-semibold text-green-700 dark:text-green-400">{order.totalText}</div>
                      <div className="flex gap-2 justify-end mt-2 print:hidden">
                        <button
                          onClick={() => handleEditClick(order)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {order.items.map(item => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 items-center bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg"
                      >
                        <img
                          src={ensureImgPath(item.gambar)}
                          alt={item.nama}
                          className="w-20 h-16 object-cover rounded border"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/1.jpeg';
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-neutral-800 dark:text-neutral-200">{item.nama}</div>
                          <div className="text-xs text-neutral-500">
                            {item.qty} x {item.hargaText}
                          </div>
                          <div className="text-xs font-semibold text-green-700 dark:text-green-400">
                            {formatRp(item.qty * item.hargaInt)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal Edit */}
      {editOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Laporan</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nama Pembeli</label>
                <input
                  name="namaPembeli"
                  value={editOrder.namaPembeli}
                  onChange={(e) =>
                    setEditOrder(prev => prev && { ...prev, namaPembeli: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm bg-white dark:bg-neutral-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Kontak</label>
                <input
                  name="kontak"
                  value={editOrder.kontak}
                  onChange={(e) =>
                    setEditOrder(prev => prev && { ...prev, kontak: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm bg-white dark:bg-neutral-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Lokasi</label>
                <input
                  name="lokasi"
                  value={editOrder.lokasi}
                  onChange={(e) =>
                    setEditOrder(prev => prev && { ...prev, lokasi: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm bg-white dark:bg-neutral-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={editOrder.status}
                  onChange={(e) =>
                    setEditOrder(prev => prev && { ...prev, status: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm bg-white dark:bg-neutral-700"
                >
                  <option value="Dikirim">Dikirim</option>
                  <option value="Diterima">Diterima</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditOrder(null)}
                className="text-sm px-4 py-2 rounded bg-gray-200 dark:bg-neutral-700"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="text-sm px-4 py-2 rounded bg-blue-600 text-white"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
