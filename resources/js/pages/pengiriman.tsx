import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Truck, LocateFixed } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState } from 'react';

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

const dataPengiriman = [
  {
    nama: 'Budi Santoso',
    tanggal: '2025-08-05',
    total: 'Rp1.250.000',
    kontak: '081234567890',
    lokasi: 'Jakarta',
    koordinat: [-6.2, 106.816666],
    status: 'Dikirim',
  },
  {
    nama: 'Siti Aminah',
    tanggal: '2025-08-04',
    total: 'Rp850.000',
    kontak: '082212345678',
    lokasi: 'Bandung',
    koordinat: [-6.914744, 107.60981],
    status: 'Diterima',
  },
  {
    nama: 'Andi Pratama',
    tanggal: '2025-08-03',
    total: 'Rp1.700.000',
    kontak: '085612345432',
    lokasi: 'Surabaya',
    koordinat: [-7.257472, 112.75209],
    status: 'Dibatalkan',
  },
  {
    nama: 'Dewi Rahma',
    tanggal: '2025-08-02',
    total: 'Rp1.050.000',
    kontak: '081298765432',
    lokasi: 'Makassar',
    koordinat: [-5.147665, 119.432732],
    status: 'Dikirim',
  },
];

function FlyToLocation({ koordinat }: { koordinat: [number, number] }) {
  const map = useMap();
  map.flyTo(koordinat, 11, {
    duration: 1.5,
  });
  return null;
}

export default function PengirimanPage() {
  const [lokasiFokus, setLokasiFokus] = useState<[number, number] | null>(null);
  const [search, setSearch] = useState('');

  const filteredData = dataPengiriman.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pengiriman Barang" />
      <style>{`
        @media print {
          .break-page {
            page-break-before: always;
          }
        }
      `}</style>

      <div className="p-6 space-y-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 space-y-6">
          {/* Judul dan Filter */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold flex items-center gap-3 text-blue-700 dark:text-blue-400">
              <Truck size={30} /> Pengiriman Barang
            </h1>
            <input
              type="text"
              placeholder="🔍 Cari nama atau lokasi..."
              className="px-4 py-2 border rounded-md w-full md:w-64 dark:bg-neutral-900 dark:text-white dark:border-neutral-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto rounded-lg border dark:border-neutral-700">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-blue-100 dark:bg-neutral-700 text-blue-900 dark:text-white font-semibold">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Kontak</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-neutral-700">
                {filteredData.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
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
                    <td className="px-4 py-2">
                      <button
                        onClick={() => setLokasiFokus(item.koordinat)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-white transition"
                      >
                        <LocateFixed size={16} /> Lihat Lokasi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length === 0 && (
              <p className="text-center text-sm p-4 text-neutral-600 dark:text-neutral-300">
                Tidak ada data pengiriman ditemukan.
              </p>
            )}
          </div>

          {/* Map dipisah ke halaman baru saat print */}
          <div className="break-page">
            <h2 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-300">
              Peta Lokasi Pengiriman
            </h2>
            <div className="w-full h-[350px] rounded-lg overflow-hidden border dark:border-neutral-700">
              <MapContainer
                center={[-2.5489, 118.0149]}
                zoom={5}
                scrollWheelZoom={true}
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                />
                {lokasiFokus && <FlyToLocation koordinat={lokasiFokus} />}
                {dataPengiriman.map((item, idx) => (
                  <Marker key={idx} position={item.koordinat}>
                    <Popup>
                      <strong>{item.nama}</strong><br />
                      {item.lokasi}<br />
                      {item.tanggal}<br />
                      {item.total}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
