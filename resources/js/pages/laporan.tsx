// resources/js/Pages/LaporanPengiriman.tsx
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Truck, Download, Edit2, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'SCM', href: '/dashboard' },
  { title: 'Laporan Pengiriman', href: '/pengiriman/laporan' },
];

type OrderItem = {
  id: number;
  nama: string;
  hargaInt: number;
  qty: number;
  gambar?: string;
  status?: string; // optional per item
};

type Order = {
  id: string;
  namaPembeli: string;
  tanggal: string; // yyyy-mm-dd
  totalText: string;
  totalInt: number;
  kontak: string;
  lokasi: string;
  status: string; // Dikirim | Diterima | Dibatalkan | Pending
  items?: OrderItem[];
};

function readOrders(): Order[] {
  try {
    const raw = localStorage.getItem('scm_orders');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]) {
  try {
    localStorage.setItem('scm_orders', JSON.stringify(orders));
  } catch {
    // ignore
  }
}

function formatRp(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function exportCsv(orders: Order[]) {
  if (!orders.length) return;
  const header = ['ID', 'Nama Pembeli', 'Tanggal', 'Total', 'Kontak', 'Lokasi', 'Status', 'Items'];
  const rows = orders.map((o) => [
    o.id,
    o.namaPembeli,
    o.tanggal,
    o.totalText,
    o.kontak,
    o.lokasi,
    o.status,
    (o.items || []).map(it => `${it.nama} x${it.qty}`).join('; '),
  ]);
  const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `laporan_pengiriman_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function LaporanPengiriman() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [q, setQ] = useState('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');

  // UI state: edit modal & delete confirm
  const [editing, setEditing] = useState<Order | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Order | null>(null);
  const [expandedOrderIds, setExpandedOrderIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOrders(readOrders());
    function onStorage(e: StorageEvent) {
      if (e.key === 'scm_orders') setOrders(readOrders());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return orders.filter((o) => {
      if (qLower && !o.namaPembeli.toLowerCase().includes(qLower) && !o.lokasi.toLowerCase().includes(qLower)) {
        return false;
      }
      if (statusFilter !== 'Semua' && o.status !== statusFilter) return false;
      if (fromDate && o.tanggal < fromDate) return false;
      if (toDate && o.tanggal > toDate) return false;
      return true;
    }).sort((a,b) => b.tanggal.localeCompare(a.tanggal));
  }, [orders, q, fromDate, toDate, statusFilter]);

  const totals = useMemo(() => {
    const count = filtered.length;
    const totalNominal = filtered.reduce((s, o) => s + (o.totalInt || 0), 0);
    return { count, totalNominal };
  }, [filtered]);

  // Actions
  function handleOpenEdit(o: Order) {
    // clone to avoid direct mutation
    setEditing(JSON.parse(JSON.stringify(o)));
  }

  function handleSaveEdit() {
    if (!editing) return;
    // basic validation
    if (!editing.namaPembeli.trim()) {
      alert('Nama pembeli harus diisi.');
      return;
    }
    // update in orders
    const next = orders.map((o) => (o.id === editing.id ? editing : o));
    setOrders(next);
    writeOrders(next);
    setEditing(null);
  }

  function handleRequestDelete(o: Order) {
    setConfirmDelete(o);
  }

  function handleConfirmDelete() {
    if (!confirmDelete) return;
    const next = orders.filter((o) => o.id !== confirmDelete.id);
    setOrders(next);
    writeOrders(next);
    setConfirmDelete(null);
  }

  function toggleExpand(id: string) {
    setExpandedOrderIds(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Laporan Pengiriman" />
      <style>{`@media print { .no-print { display: none !important } }`}</style>

      <div className="p-6 space-y-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-sky-600">
                <Truck /> Laporan Pengiriman
              </h1>
              <div className="text-sm text-neutral-500 mt-1">Menampilkan pesanan yang telah di-checkout. Edit atau hapus jika perlu.</div>
            </div>

            <div className="flex gap-2 items-center no-print">
              <button onClick={() => exportCsv(filtered)} className="flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded hover:bg-neutral-200">
                <Download /> Ekspor CSV
              </button>
              <button onClick={() => window.print()} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Cetak Laporan</button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              className="md:col-span-2 px-3 py-2 border rounded"
              placeholder="Cari nama atau lokasi..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <input type="date" className="px-3 py-2 border rounded" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <input type="date" className="px-3 py-2 border rounded" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            <select className="px-3 py-2 border rounded" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option>Semua</option>
              <option>Dikirim</option>
              <option>Diterima</option>
              <option>Dibatalkan</option>
              <option>Pending</option>
            </select>
          </div>

          {/* Summary */}
          <div className="flex items-center justify-between text-sm text-neutral-600">
            <div>{totals.count} pesanan ditampilkan</div>
            <div className="font-semibold">Total nominal: {formatRp(totals.totalNominal)}</div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border dark:border-neutral-700">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Kontak</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 no-print">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-neutral-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-6 text-center text-neutral-500">Tidak ada data laporan pengiriman.</td>
                  </tr>
                ) : (
                  filtered.map((o, i) => (
                    <tr key={o.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 align-top">
                      <td className="px-4 py-3">{i + 1}</td>
                      <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{o.namaPembeli}</div>
                        {o.items && o.items.length > 0 && (
                          <button onClick={() => toggleExpand(o.id)} className="text-xs text-neutral-500 hover:underline mt-1 no-print">
                            {expandedOrderIds[o.id] ? 'Sembunyikan item' : `Lihat item (${o.items.length})`}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3">{o.tanggal}</td>
                      <td className="px-4 py-3">{o.totalText}</td>
                      <td className="px-4 py-3">{o.kontak}</td>
                      <td className="px-4 py-3">{o.lokasi}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          o.status === 'Dikirim' ? 'bg-yellow-100 text-yellow-800' :
                          o.status === 'Diterima' ? 'bg-green-100 text-green-800' :
                          o.status === 'Dibatalkan' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 no-print">
                        <div className="flex gap-2">
                          <button onClick={() => handleOpenEdit(o)} className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 flex items-center gap-2">
                            <Edit2 size={14} /> Edit
                          </button>
                          <button onClick={() => handleRequestDelete(o)} className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 flex items-center gap-2">
                            <Trash2 size={14} /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Expanded items list per order (rendered below table for simplicity) */}
            <div className="p-4 space-y-4">
              {filtered.filter(o => expandedOrderIds[o.id]).map(o => (
                <div key={`items-${o.id}`} className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded">
                  <div className="font-semibold mb-2">Item untuk {o.namaPembeli} (Order {o.id})</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(o.items || []).map(it => (
                      <div key={it.id} className="flex gap-3 items-center bg-white dark:bg-neutral-800 p-3 rounded border dark:border-neutral-700">
                        <img src={it.gambar ? (it.gambar.startsWith('/') ? it.gambar : `/${it.gambar}`) : '/1.jpeg'} alt={it.nama} className="w-16 h-12 object-cover rounded" />
                        <div className="flex-1">
                          <div className="font-medium">{it.nama}</div>
                          <div className="text-sm text-neutral-500">Qty: {it.qty} • {formatRp(it.hargaInt)}</div>
                          {it.status && <div className="text-xs mt-1">Status item: <span className="font-medium">{it.status}</span></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div onClick={() => setEditing(null)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-[95%] max-w-2xl p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"><Edit2 /> Edit Order</h3>
              <button onClick={() => setEditing(null)} className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"><X /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm">Nama Pembeli</label>
                <input className="w-full px-3 py-2 border rounded" value={editing.namaPembeli} onChange={(e) => setEditing({ ...editing, namaPembeli: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm">Tanggal</label>
                  <input type="date" className="w-full px-3 py-2 border rounded" value={editing.tanggal} onChange={(e) => setEditing({ ...editing, tanggal: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm">Kontak</label>
                  <input className="w-full px-3 py-2 border rounded" value={editing.kontak} onChange={(e) => setEditing({ ...editing, kontak: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm">Lokasi</label>
                  <input className="w-full px-3 py-2 border rounded" value={editing.lokasi} onChange={(e) => setEditing({ ...editing, lokasi: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-sm">Status</label>
                <select className="w-full px-3 py-2 border rounded" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                  <option>Pending</option>
                  <option>Dikirim</option>
                  <option>Diterima</option>
                  <option>Dibatalkan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm">Items (read-only)</label>
                <div className="mt-2 space-y-2 max-h-48 overflow-auto">
                  {(editing.items || []).map(it => (
                    <div key={it.id} className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800 p-2 rounded border dark:border-neutral-700">
                      <img src={it.gambar ? (it.gambar.startsWith('/') ? it.gambar : `/${it.gambar}`) : '/1.jpeg'} alt={it.nama} className="w-12 h-10 object-cover rounded" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{it.nama}</div>
                        <div className="text-xs text-neutral-500">Qty: {it.qty} • {formatRp(it.hargaInt)}</div>
                      </div>
                      {it.status && <div className="text-xs text-neutral-500">Status: {it.status}</div>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button onClick={() => setEditing(null)} className="px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-800">Batal</button>
                <button onClick={handleSaveEdit} className="px-4 py-2 rounded bg-indigo-600 text-white">Simpan Perubahan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div onClick={() => setConfirmDelete(null)} className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white dark:bg-neutral-900 rounded-lg shadow p-6 z-10 w-[90%] max-w-md">
            <div className="text-lg font-semibold mb-2">Hapus Pesanan</div>
            <p className="text-sm text-neutral-600">Apakah Anda yakin ingin menghapus pesanan <span className="font-medium">{confirmDelete.id}</span>? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-800">Batal</button>
              <button onClick={handleConfirmDelete} className="px-3 py-2 rounded bg-red-600 text-white">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
