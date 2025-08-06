// resources/js/Pages/KeranjangPage.tsx
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

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

function ensureImgPath(path?: string) {
  if (!path) return '/1.jpeg';
  return path.startsWith('/') ? path : `/${path}`;
}

function formatRp(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function KeranjangPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  // load cart on mount
  useEffect(() => {
    setItems(readCart());

    // sync if other tab modifies cart
    function onStorage(e: StorageEvent) {
      if (e.key === 'scm_cart') {
        setItems(readCart());
      }
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Keranjang - SCM" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Keranjang Saya</h1>
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
                  onClick={() => alert('Checkout placeholder — hubungkan ke backend/payment gateway')}
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
      </div>
    </AppLayout>
  );
}
