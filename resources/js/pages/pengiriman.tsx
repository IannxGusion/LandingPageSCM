import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Atur ikon default Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type OrderItem = {
  id: number;
  nama: string;
  qty: number;
};

type Order = {
  id: string;
  namaPembeli: string;
  tanggal: string;
  totalText: string;
  lokasi: string;
  status: string;
  items?: OrderItem[];
  koordinat?: [number, number];
};

const CITY_COORDS: Record<string, [number, number]> = {
  jakarta: [-6.2088, 106.8456],
  serang: [-6.1149, 106.1503],
  tangerang: [-6.1783, 106.6319],
  cilegon: [-6.0153, 106.0539],
  lebak: [-6.5644, 106.2522],
  pandeglang: [-6.3265, 106.1035],
  bandung: [-6.9147, 107.6098],
  bekasi: [-6.2383, 106.9756],
  bogor: [-6.595, 106.8166],
  cirebon: [-6.732, 108.5523],
  sukabumi: [-6.922, 106.931],
  semarang: [-7.0051, 110.4381],
  surakarta: [-7.5718, 110.8166],
  pekalongan: [-6.888, 109.675],
  magelang: [-7.4797, 110.2177],
  cilacap: [-7.716, 109.015],
  surabaya: [-7.2575, 112.7521],
  malang: [-7.9797, 112.6304],
  sidoarjo: [-7.4465, 112.7181],
  jember: [-8.1724, 113.7001],
  madiun: [-7.627, 111.523],
  yogyakarta: [-7.8014, 110.3647],
  bantul: [-7.888, 110.3288],
  sleman: [-7.7161, 110.3554],
  kulonprogo: [-7.8407, 110.0892],
  gunungkidul: [-8.0287, 110.6169],
  denpasar: [-8.65, 115.2167],
  gianyar: [-8.5283, 115.3253],
  badung: [-8.5819, 115.1766],
  buleleng: [-8.112, 115.088],
  karangasem: [-8.4467, 115.6156],
  mataram: [-8.5833, 116.1167],
  bima: [-8.4606, 118.7278],
  dompu: [-8.537, 118.4619],
  kupang: [-10.1772, 123.607],
  ende: [-8.845, 121.6622],
  maumere: [-8.6196, 122.2115],
};

const DEFAULT_CENTER: [number, number] = [-7.5, 112.5];

function guessCoords(loc?: string): [number, number] | null {
  if (!loc) return null;
  const key = loc.trim().toLowerCase().replace(/\s+/g, '');
  for (const city in CITY_COORDS) {
    if (key.includes(city)) return CITY_COORDS[city];
  }
  return null;
}

function FlyToLocation({ koordinat }: { koordinat: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (koordinat) {
      map.flyTo(koordinat, 11);
    }
  }, [koordinat, map]);
  return null;
}

export default function PengirimanPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [fokus, setFokus] = useState<[number, number] | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('scm_orders');
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data)) setOrders(data);
      }
    } catch (err) {
      console.error('Gagal memuat data pesanan dari localStorage', err);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return orders;
    return orders.filter(o =>
      o.namaPembeli.toLowerCase().includes(q) ||
      o.lokasi.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q)
    );
  }, [search, orders]);

  const mapCenter: [number, number] = fokus ?? DEFAULT_CENTER;

  return (
    <AppLayout>
      <Head title="Pengiriman" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-8 shadow-xl"
      >
        <h1 className="text-4xl font-bold tracking-tight">Pengiriman</h1>
        <p className="mt-2 text-white/90 text-lg max-w-xl">Informasi pengiriman dengan lokasi pembeli</p>
      </motion.div>

      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <input
            type="search"
            className="border border-neutral-300 px-4 py-2 rounded-md w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cari nama, lokasi, atau ID"
            aria-label="Cari pengiriman berdasarkan nama, lokasi, atau ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto border rounded shadow-sm">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Nama</th>
                <th className="p-2 text-left">Tanggal</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Lokasi</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  filtered.map(order => {
                    const coords = order.koordinat ?? guessCoords(order.lokasi);
                    return (
                      <motion.tr
                        key={order.id}
                        className="border-t hover:bg-neutral-50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="p-2">{order.id}</td>
                        <td className="p-2">{order.namaPembeli}</td>
                        <td className="p-2">{order.tanggal}</td>
                        <td className="p-2">{order.totalText}</td>
                        <td className="p-2">{order.lokasi}</td>
                        <td className="p-2">
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                            {order.status}
                          </span>
                        </td>
                        <td className="p-2">
                          <button
                            type="button"
                            onClick={() => setFokus(coords ?? null)}
                            className="text-blue-600 hover:underline text-sm"
                            aria-label={`Lihat lokasi pengiriman untuk ${order.namaPembeli}`}
                            disabled={!coords}
                          >
                            Lihat Lokasi
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="border rounded overflow-hidden shadow-sm"
        >
          <MapContainer center={mapCenter} zoom={6} scrollWheelZoom style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {fokus && <FlyToLocation koordinat={fokus} />}
            {orders.map(order => {
              const coords = order.koordinat ?? guessCoords(order.lokasi);
              if (!coords) return null;
              return (
                <Marker key={order.id} position={coords}>
                  <Popup>
                    <strong>{order.namaPembeli}</strong>
                    <br />
                    {order.id}
                    <br />
                    {order.lokasi}
                    <br />
                    Status: {order.status}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </motion.div>
      </div>
    </AppLayout>
  );
}
