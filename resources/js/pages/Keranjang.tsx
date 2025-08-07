// resources/js/Pages/KeranjangPage.tsx
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'SCM', href: '/dashboard' },
  { title: 'Keranjang', href: '/keranjang' },
];

type CartItem = {
  id: number;
  nama: string;
  hargaText: string;
  hargaInt: number;
  qty: number;
  gambar?: string;
};

type Order = {
  id: string;
  namaPembeli: string;
  tanggal: string; // yyyy-mm-dd
  totalText: string;
  totalInt: number;
  kontak: string;
  lokasi: string;
  status: string;
  items: CartItem[];
};

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem('scm_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  try {
    localStorage.setItem('scm_cart', JSON.stringify(items));
  } catch {
    /* ignore storage errors */
  }
}

function readOrders(): Order[] {
  try {
    const raw = localStorage.getItem('scm_orders');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]) {
  try {
    localStorage.setItem('scm_orders', JSON.stringify(orders));
  } catch {
    /* ignore */
  }
}

function ensureImgPath(path?: string) {
  if (!path) return '/1.jpeg';
  return path.startsWith('/') ? path : `/${path}`;
}

function formatRp(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function KeranjangPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // checkout form
  const [namaPembeli, setNamaPembeli] = useState('');
  const [kontak, setKontak] = useState('');
  const [lokasi, setLokasi] = useState('');

  useEffect(() => {
    setItems(readCart());
    function onStorage(e: StorageEvent) {
      if (e.key === 'scm_cart') setItems(readCart());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function updateQty(id: number, qty: number) {
    const next = items.map(it => (it.id === id ? { ...it, qty: Math.max(1, qty) } : it));
    setItems(next);
    writeCart(next);
  }

  function removeItem(id: number) {
    const next = items.filter(it => it.id !== id);
    setItems(next);
    writeCart(next);
  }

  function clearCart() {
    setItems([]);
    writeCart([]);
  }

  const subtotal = items.reduce((s, it) => s + (it.hargaInt || 0) * it.qty, 0);

  function openCheckout() {
    setNamaPembeli('');
    setKontak('');
    setLokasi('');
    setCheckoutOpen(true);
  }

  function closeCheckout() {
    setCheckoutOpen(false);
  }

  function buildOrderFromCart(): Order | null {
    if (!items.length) return null;
    const totalInt = subtotal;
    const totalText = formatRp(totalInt);
    const id = `ORD-${Date.now()}`;
    const tanggal = new Date().toISOString().slice(0, 10);
    const order: Order = {
      id,
      namaPembeli: namaPembeli || 'Pembeli',
      tanggal,
      totalText,
      totalInt,
      kontak: kontak || '-',
      lokasi: lokasi || '-',
      status: 'Pending',
      items,
    };
    return order;
  }

  async function confirmCheckout() {
    if (!items.length) {
      alert('Keranjang kosong.');
      return;
    }
    if (!namaPembeli.trim()) {
      alert('Masukkan nama pembeli.');
      return;
    }
    if (!kontak.trim()) {
      alert('Masukkan kontak (telepon).');
      return;
    }
    if (!lokasi.trim()) {
      alert('Masukkan lokasi pengiriman.');
      return;
    }

    setLoading(true);
    try {
      const order = buildOrderFromCart();
      if (!order) throw new Error('Tidak ada item untuk di-checkout.');

      // simpan ke localStorage (scm_orders)
      const existing = readOrders();
      existing.push(order);
      writeOrders(existing);

      // kosongkan keranjang
      clearCart();

      // close modal
      setCheckoutOpen(false);

      // navigasi ke halaman laporan/pengiriman
      // ganti path jika kamu ingin ke route laporan spesifik, mis: '/pengiriman/laporan'
      router.visit('/pengiriman');

      // optionally: show feedback (Inertia flash or alert)
      // simple alert for feedback
      alert(`Checkout berhasil. Order ID: ${order.id}`);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat checkout.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Keranjang - SCM" />
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-8 shadow-xl">
              <h1 className="text-4xl font-bold tracking-tight">Keranjang Saya</h1>
              <p className="mt-2 text-white/90 text-lg max-w-xl">Anda Bisa Membeli Apa Saja Yang Anda Mau</p>
            </motion.div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-neutral-500">{items.length} item</div>
        </div>

        {items.length === 0 ? (
          <div className="p-8 bg-white dark:bg-neutral-800 rounded-lg text-center text-neutral-500 space-y-4">
            <div className="text-lg font-medium">Keranjang kosong</div>
            <div className="text-sm">Tambahkan produk ke keranjang lalu lanjut ke checkout.</div>
            <div className="flex justify-center mt-4 gap-3">
              <button
                onClick={() => router.visit('/produkpage')}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
              >
                Lanjut Belanja
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map(it => (
                <div key={it.id} className="flex gap-4 items-center bg-white dark:bg-neutral-800 p-4 rounded-lg border dark:border-neutral-700">
                  <img
                    src={ensureImgPath(it.gambar)}
                    alt={it.nama}
                    className="w-28 h-20 object-cover rounded"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/1.jpeg'; }}
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{it.nama}</div>
                    <div className="text-sm text-neutral-500">{it.hargaText}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(it.id, it.qty - 1)}
                        className="px-2 py-1 border rounded"
                        aria-label={`Kurangi jumlah ${it.nama}`}
                      >
                        -
                      </button>
                      <div className="px-3 py-1 border rounded">{it.qty}</div>
                      <button
                        onClick={() => updateQty(it.id, it.qty + 1)}
                        className="px-2 py-1 border rounded"
                        aria-label={`Tambah jumlah ${it.nama}`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold">{formatRp((it.hargaInt || 0) * it.qty)}</div>
                    <button
                      onClick={() => removeItem(it.id)}
                      className="mt-2 text-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Hapus
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between mt-4">
                <button onClick={clearCart} className="px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100">
                  Kosongkan Keranjang
                </button>

                <div className="text-sm text-neutral-500">Perubahan disimpan otomatis.</div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border dark:border-neutral-700">
              <div className="font-semibold text-lg">Ringkasan Pesanan</div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-neutral-500">Subtotal</div>
                <div className="font-semibold">{formatRp(subtotal)}</div>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={openCheckout}
                  className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium"
                >
                  Checkout
                </button>

                <button
                  onClick={() => router.visit('/produkpage')}
                  className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-700"
                >
                  Lanjut Belanja
                </button>
              </div>

              <div className="mt-3 text-xs text-neutral-400">Pembayaran & pengiriman harus dihubungkan ke backend untuk produksi.</div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {checkoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div onClick={closeCheckout} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-[90%] max-w-2xl p-6 z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Checkout</h2>
                <button onClick={closeCheckout} className="px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">Tutup</button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm">Nama Pembeli</label>
                  <input value={namaPembeli} onChange={(e) => setNamaPembeli(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Nama lengkap" />
                </div>

                <div>
                  <label className="block text-sm">Kontak</label>
                  <input value={kontak} onChange={(e) => setKontak(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Nomor telepon" />
                </div>

                <div>
                  <label className="block text-sm">Lokasi Pengiriman</label>
                  <input value={lokasi} onChange={(e) => setLokasi(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Kota / alamat" />
                </div>

                <div className="text-sm text-neutral-500">Total: <span className="font-semibold">{formatRp(subtotal)}</span></div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={confirmCheckout}
                    disabled={loading}
                    className="flex-1 px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
                  >
                    {loading ? 'Memproses...' : 'Konfirmasi & Checkout'}
                  </button>
                  <button onClick={closeCheckout} className="px-4 py-2 rounded bg-neutral-100 dark:bg-neutral-800">Batal</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
