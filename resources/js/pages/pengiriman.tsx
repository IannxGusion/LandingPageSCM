// resources/js/Pages/PengirimanPage.tsx
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Truck, LocateFixed, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'SCM', href: '/dashboard' },
  { title: 'Pengiriman', href: '/pengiriman' },
];

type OrderItem = {
  id: number;
  nama: string;
  hargaInt: number;
  qty: number;
  gambar?: string;
  status?: string;
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
  koordinat?: [number, number]; // optional
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

/** Simple offline lookup mapping lokasi text -> koordinat.
 * Tambah kota lain sesuai kebutuhan atau hubungkan geocoding API jika perlu.
 */
const CITY_COORDS: Record<string, [number, number]> = {
  jakarta: [-6.208763, 106.845599],
  bandung: [-6.914744, 107.60981],
  surabaya: [-7.257472, 112.75209],
  makassar: [-5.147665, 119.432732],
  yogyakarta: [-7.79558, 110.36949],
  semarang: [-6.966667, 110.416664],
  medan: [3.583333, 98.666664],
  bali: [-8.409518, 115.188919],
};

const DEFAULT_CENTER: [number, number] = [-2.548926, 118.014863]; // pusat Indonesia

function guessCoordsFromLocation(loc?: string): [number, number] | null {
  if (!loc) return null;
  const normal = loc.trim().toLowerCase();
  for (const key of Object.keys(CITY_COORDS)) {
    if (normal.includes(key)) return CITY_COORDS[key];
  }
  const tokens = normal.split(/[,\/\-]/).map(t => t.trim());
  for (const t of tokens) {
    if (CITY_COORDS[t]) return CITY_COORDS[t];
  }
  return null;
}

function FlyToLocation({ koordinat }: { koordinat: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (!koordinat) return;
    map.flyTo(koordinat, 11, { duration: 1.1 });
  }, [koordinat, map]);
  return null;
}

export default function PengirimanPage(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [lokasiFokus, setLokasiFokus] = useState<[number, number] | null>(null);
  const [showMapPopupOrderId, setShowMapPopupOrderId] = useState<string | null>(null);
  const markerRefs = useRef<Record<string, any>>({});
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setOrders(readOrders());
    function onStorage(e: StorageEvent) {
      if (e.key === 'scm_orders') setOrders(readOrders());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Build markers list (with coords guessed when needed)
  const markers = useMemo(() => {
    return orders.map((o) => {
      const coords = o.koordinat ?? guessCoordsFromLocation(o.lokasi) ?? null;
      return { order: o, coords };
    });
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => {
      return (
        o.namaPembeli.toLowerCase().includes(q) ||
        o.lokasi.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    });
  }, [orders, search]);

  // map center: fokus jika ada, otherwise default
  const mapCenter: [number, number] = lokasiFokus ?? DEFAULT_CENTER;

  // when showMapPopupOrderId changes, open popup on corresponding marker (if present)
  useEffect(() => {
    if (!showMapPopupOrderId) return;
    const ref = markerRefs.current[showMapPopupOrderId];
    try {
      // react-leaflet Marker instance has .openPopup() via the underlying Leaflet marker
      if (ref && typeof ref.openPopup === 'function') {
        ref.openPopup();
      } else if (ref && ref.current && typeof ref.current.openPopup === 'function') {
        ref.current.openPopup();
      }
    } catch {
      // ignore
    }
  }, [showMapPopupOrderId]);

  // framer-motion variants (use any to avoid strict typing friction)
  const container: any = shouldReduceMotion ? undefined : { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const fadeUp: any = shouldReduceMotion ? undefined : { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } } };
  const rowHover = { y: -6, boxShadow: '0 10px 30px rgba(2,6,23,0.12)' };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pengiriman Barang" />
      <style>{`
        @media print { .no-print { display: none !important } }
        .map-glow { box-shadow: 0 8px 40px rgba(59,130,246,0.12); border-radius: 12px; }
      `}</style>

      <div className="p-6 space-y-6">
        {/* Welcome card */}
        <motion.div
          {...(container ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 }, variants: container } : {})}
          className="rounded-2xl p-6 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm border border-white/10 shadow-lg"
        >
          <motion.div {...(fadeUp ? { variants: fadeUp } : {})} className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-md">
                <Truck size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">Selamat datang di Dashboard Pengiriman</h1>
                <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">Pantau status pengiriman, lihat lokasi, dan kelola order secara cepat.</div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 ml-auto flex gap-3 items-center">
              <div className="text-sm text-slate-600 dark:text-slate-300 text-right">
                <div className="font-semibold">Total Orders</div>
                <div className="text-lg font-bold">{orders.length}</div>
              </div>
              <button
                onClick={() => { setSearch(''); setLokasiFokus(null); setShowMapPopupOrderId(null); }}
                className="px-4 py-2 rounded-md bg-white dark:bg-neutral-900 border hover:scale-102 transition transform no-print"
              >
                Reset
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Main card: table (top) */}
        <motion.div
          {...(container ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.12 }, variants: container } : {})}
          className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-6"
        >
          {/* search + controls */}
          <motion.div {...(fadeUp ? { variants: fadeUp } : {})} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 Cari nama, lokasi atau ID order..."
                className="w-full md:w-96 px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button onClick={() => { setSearch(''); }} className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:brightness-105 transition no-print">Bersihkan</button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-500 dark:text-slate-300">Tampilkan: <strong className="ml-1">{filtered.length}</strong></div>
            </div>
          </motion.div>

          <motion.div {...(fadeUp ? { variants: fadeUp } : {})} className="overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-700">
            <table className="min-w-full text-sm">
              <thead className="bg-indigo-50 dark:bg-neutral-700 text-indigo-800 dark:text-white font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left">Tanggal</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Lokasi</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left no-print">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y dark:divide-neutral-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-neutral-500">Belum ada data pengiriman.</td>
                  </tr>
                ) : (
                  filtered.map((o, idx) => {
                    const coords = o.koordinat ?? guessCoordsFromLocation(o.lokasi);
                    return (
                      <motion.tr
                        key={o.id}
                        {...(fadeUp ? { variants: fadeUp } : {})}
                        whileHover={!shouldReduceMotion ? rowHover : undefined}
                        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                        className="hover:bg-gray-50 dark:hover:bg-neutral-700"
                      >
                        <td className="px-4 py-3 align-top">{idx + 1}</td>
                        <td className="px-4 py-3 align-top font-mono text-xs">{o.id}</td>
                        <td className="px-4 py-3 align-top">{o.namaPembeli}</td>
                        <td className="px-4 py-3 align-top">{o.tanggal}</td>
                        <td className="px-4 py-3 align-top">{o.totalText}</td>
                        <td className="px-4 py-3 align-top">{o.lokasi}</td>
                        <td className="px-4 py-3 align-top">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm transition-all duration-300 ${
                            o.status === 'Dikirim' ? 'bg-yellow-200 text-yellow-900 animate-pulse' :
                            o.status === 'Diterima' ? 'bg-green-200 text-green-900' :
                            o.status === 'Dibatalkan' ? 'bg-red-200 text-red-900' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top no-print">
                          <div className="flex gap-2 items-center">
                            <motion.button
                              onClick={() => {
                                const c = coords ?? DEFAULT_CENTER;
                                setLokasiFokus(c);
                                setShowMapPopupOrderId(o.id);
                                // scroll to map for UX
                                const el = document.getElementById('map-area');
                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }}
                              whileHover={!shouldReduceMotion ? { scale: 1.03 } : undefined}
                              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 transition text-sm"
                            >
                              <LocateFixed size={14} /> Lihat Lokasi
                            </motion.button>

                            <button className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs">Detail</button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </motion.div>
        </motion.div>

        {/* Map area (below table) */}
        <motion.div
          id="map-area"
          {...(container ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.12 }, variants: container } : {})}
          className={`bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-6 ${lokasiFokus ? 'map-glow' : ''}`}
        >
          <motion.div {...(fadeUp ? { variants: fadeUp } : {})} className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">Peta Lokasi Pengiriman</div>
              <div className="text-xs text-slate-500 dark:text-slate-300">Klik "Lihat Lokasi" untuk fokus ke titik. Scroll akan membawa Anda ke peta.</div>
            </div>
            <div className="text-xs text-slate-500">{markers.filter(m => m.coords).length} lokasi terdeteksi</div>
          </motion.div>

          <motion.div {...(fadeUp ? { variants: fadeUp } : {})} className="rounded-xl overflow-hidden border border-gray-100 dark:border-neutral-700">
            <div className="h-[520px]">
              <MapContainer center={mapCenter} zoom={5} scrollWheelZoom style={{ width: '100%', height: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                />
                {lokasiFokus && <FlyToLocation koordinat={lokasiFokus} />}

                {markers.map(({ order, coords }) => {
                  if (!coords) return null;
                  return (
                    <Marker
                      key={order.id}
                      position={coords}
                      ref={(el) => {
                        // store reference so we can open popup programmatically later
                        if (el) markerRefs.current[order.id] = el;
                      }}
                    >
                      <Popup autoClose={false} closeOnClick={false}>
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.26 }}>
                          <div className="max-w-xs">
                            <div className="font-semibold text-sm">{order.namaPembeli}</div>
                            <div className="text-xs text-neutral-500">{order.id} • {order.tanggal}</div>
                            <div className="text-sm mt-2">{order.totalText}</div>
                            <div className="text-xs mt-1">Status: <strong>{order.status}</strong></div>
                            {order.items && order.items.length > 0 && (
                              <div className="mt-2">
                                <div className="text-xs font-semibold">Items:</div>
                                <ul className="text-xs list-disc pl-5">
                                  {order.items.map(it => (
                                    <li key={it.id}>{it.nama} x{it.qty}{it.status ? ` — ${it.status}` : ''}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>

            <div className="p-3 text-xs text-slate-500 dark:text-slate-400">Jika lokasi tidak dikenali, peta akan menampilkan koordinat default. Simpan koordinat saat checkout untuk akurasi terbaik.</div>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
