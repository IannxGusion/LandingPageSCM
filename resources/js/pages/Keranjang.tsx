// src/Pages/KeranjangPage.tsx
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
  tanggal: string;
  totalText: string;
  totalInt: number;
  kontak: string;
  lokasi: string;
  status: string;
  paymentMethod: string;
  bayarManual?: number;
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

function writeCart(items: CartItem[]): void {
  try {
    localStorage.setItem('scm_cart', JSON.stringify(items));
  } catch { }
}

function readOrders(): Order[] {
  try {
    const raw = localStorage.getItem('scm_orders');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]): void {
  try {
    localStorage.setItem('scm_orders', JSON.stringify(orders));
  } catch { }
}

function ensureImgPath(path?: string): string {
  if (!path) return '/1.jpeg';
  return path.startsWith('/') ? path : `/${path}`;
}

function formatRp(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function KeranjangPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [namaPembeli, setNamaPembeli] = useState('');
  const [kontak, setKontak] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [bayarManual, setBayarManual] = useState('');

  useEffect(() => {
    setItems(readCart());
    function onStorage(e: StorageEvent) {
      if (e.key === 'scm_cart') setItems(readCart());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function updateQty(id: number, qty: number) {
    if (qty < 1) qty = 1;
    const next = items.map(it => (it.id === id ? { ...it, qty } : it));
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

  const subtotal = items.reduce((s, it) => s + it.hargaInt * it.qty, 0);

  function buildOrder(): Order | null {
    if (items.length === 0) return null;
    const totalInt = subtotal;
    const id = `ORD-${Date.now()}`;
    const tanggal = new Date().toISOString().slice(0, 10);
    return {
      id,
      namaPembeli: namaPembeli.trim(),
      tanggal,
      totalText: formatRp(totalInt),
      totalInt,
      kontak: kontak.trim(),
      lokasi: lokasi.trim(),
      status: 'Pending',
      paymentMethod,
      bayarManual: paymentMethod !== 'COD' ? Number(bayarManual) : undefined,
      items,
    };
  }

  async function confirmCheckout() {
    if (!namaPembeli.trim()) return alert('Masukkan nama pembeli.');
    if (!kontak.trim()) return alert('Masukkan kontak.');
    if (!lokasi.trim()) return alert('Masukkan lokasi.');

    if (paymentMethod !== 'COD') {
      const nominal = parseInt(bayarManual);
      if (!nominal || nominal < subtotal) {
        return alert('Nominal pembayaran tidak cukup.');
      }
    }

    const order = buildOrder();
    if (!order) return alert('Keranjang kosong.');

    setLoading(true);
    try {
      const orders = readOrders();
      orders.push(order);
      writeOrders(orders);
      clearCart();
      setCheckoutOpen(false);
      router.visit('/pengiriman');
      alert(`Checkout berhasil. ID Pesanan: ${order.id}`);
    } catch (e) {
      alert('Gagal memproses checkout.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Keranjang - SCM" />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-8 shadow-xl"
      >
        <h1 className="text-4xl font-bold tracking-tight">Keranjang saya</h1>
        <p className="mt-2 text-white/90 text-lg max-w-xl">
          Masukan barang Kekeranjang maka anda bisa melakukan checkout
        </p>
      </motion.div>

      <div className="p-4 space-y-4">
        {items.map(item => (
          <motion.div
            layout
            key={item.id}
            className="flex items-center gap-4 border p-3 rounded shadow-sm bg-white dark:bg-neutral-900"
          >
            <img
              src={ensureImgPath(item.gambar)}
              alt={item.nama}
              className="w-20 h-20 object-cover rounded border"
            />
            <div className="flex-1">
              <div className="font-semibold">{item.nama}</div>
              <div className="text-sm text-neutral-500">{item.hargaText}</div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded"
                >
                  -
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded"
                >
                  +
                </button>
              </div>
            </div>
            <button onClick={() => removeItem(item.id)} className="text-red-500">
              <Trash2 size={20} />
            </button>
          </motion.div>
        ))}

        {items.length > 0 ? (
          <div className="pt-4 space-y-3">
            <div className="text-right font-semibold text-lg">
              Total: {formatRp(subtotal)}
            </div>
            <div className="flex justify-between gap-3">
              <Link
                href="/produkpage"
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded"
              >
                Lanjut Belanja
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={() => clearCart()}
                  className="px-4 py-2 bg-neutral-300 dark:bg-neutral-700 text-black dark:text-white rounded"
                >
                  Kosongkan
                </button>
                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-neutral-500">Keranjang kosong.</div>
        )}
      </div>

      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={() => setCheckoutOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />
          <div className="relative bg-white dark:bg-neutral-900 w-full max-w-xl p-6 rounded-xl z-10 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4">Checkout</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                confirmCheckout();
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm">Nama Pembeli</label>
                <input value={namaPembeli} onChange={(e) => setNamaPembeli(e.target.value)} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm">Kontak</label>
                <input value={kontak} onChange={(e) => setKontak(e.target.value)} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm">Lokasi Pengiriman</label>
                <input value={lokasi} onChange={(e) => setLokasi(e.target.value)} className="w-full px-3 py-2 border rounded" required />
              </div>

              <div>
                <label className="block text-sm mb-1">Metode Pembayaran</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                    COD
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="payment" value="E-Wallet" checked={paymentMethod === 'E-Wallet'} onChange={() => setPaymentMethod('E-Wallet')} />
                    E-Wallet
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="payment" value="QRIS" checked={paymentMethod === 'QRIS'} onChange={() => setPaymentMethod('QRIS')} />
                    QRIS
                  </label>
                </div>
              </div>

              {(paymentMethod === 'E-Wallet' || paymentMethod === 'QRIS') && (
                <div>
                  <label className="block text-sm">Nominal Pembayaran</label>
                  <input
                    type="number"
                    min="0"
                    value={bayarManual}
                    onChange={(e) => setBayarManual(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Masukkan nominal pembayaran"
                  />
                </div>
              )}

              <div className="text-sm text-neutral-600 dark:text-neutral-300 pt-2">
                Total: <span className="font-semibold">{formatRp(subtotal)}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-60">
                  {loading ? 'Memproses...' : 'Konfirmasi & Checkout'}
                </button>
                <button type="button" onClick={() => setCheckoutOpen(false)} className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
