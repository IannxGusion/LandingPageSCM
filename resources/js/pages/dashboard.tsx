import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  ShoppingCart,
  DollarSign,
  Users,
  Info,
  Truck,
  Bell,
  Search,
  CheckCircle,
  Clock,
  PackageSearch,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// register chart modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend);

const breadcrumbs: BreadcrumbItem[] = [{ title: 'SCM', href: '/dashboard' }];

export default function Dashboard() {
  // notifikasi mock
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'Order #A1023 Tertunda', body: 'Kurir melaporkan keterlambatan.', time: '10m', read: false, type: 'warning' },
    { id: 'n2', title: 'Stok Rendah: SKU-556', body: 'Sisa 3 unit.', time: '1h', read: false, type: 'info' },
    { id: 'n3', title: 'Pembayaran Sukses', body: 'Order #A1020 terbayar', time: '1d', read: true, type: 'success' },
  ]);

  const unread = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }
  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  // mock orders
  const orders = [
    { id: 'A1024', customer: 'PT Sinar', total: 'Rp 2.650.000', status: 'In Transit', eta: '2 hari' },
    { id: 'A1023', customer: 'CV Jaya', total: 'Rp 850.000', status: 'Delayed', eta: '—' },
    { id: 'A1022', customer: 'UD Maju', total: 'Rp 4.200.000', status: 'Delivered', eta: 'Selesai' },
  ];

  // --- Chart data & options (mock) ---
  const chartData = useMemo(() => {
    return {
      labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
      datasets: [
        {
          label: 'Penjualan (Rp)',
          data: [1200000, 1900000, 3000000, 500000, 2000000, 3000000, 2500000],
          borderColor: '#6366F1', // indigo-500
          backgroundColor: 'rgba(99,102,241,0.12)',
          tension: 0.35,
          yAxisID: 'y',
          pointRadius: 3,
        },
        {
          label: 'Stok Tersedia (unit)',
          data: [500, 470, 450, 420, 400, 390, 380],
          borderColor: '#16A34A', // green-600
          backgroundColor: 'rgba(22,163,74,0.08)',
          tension: 0.35,
          yAxisID: 'y1',
          type: 'line' as const,
          pointRadius: 3,
        },
      ],
    };
  }, []);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: 'rgb(100 116 139)', // neutral-500
          },
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const label = context.dataset.label ?? '';
              const value = context.parsed.y ?? context.parsed;
              if (label.toLowerCase().includes('penjualan')) {
                // format as rupiah
                return `${label}: Rp ${Number(value).toLocaleString('id-ID')}`;
              }
              return `${label}: ${value}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: 'rgb(148 163 184)' }, // neutral-400
          grid: { color: 'rgba(148,163,184,0.08)' },
        },
        y: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          ticks: {
            color: 'rgb(148 163 184)',
            callback: function (val: any) {
              // show compact rupiah
              if (typeof val === 'number') {
                if (val >= 1000000) return `Rp ${Math.round(val / 1000000)}M`;
                if (val >= 1000) return `Rp ${Math.round(val / 1000)}k`;
              }
              return `Rp ${val}`;
            },
          },
          grid: { color: 'rgba(148,163,184,0.08)' },
        },
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          grid: { drawOnChartArea: false },
          ticks: { color: 'rgb(148 163 184)' },
        },
      },
    };
  }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="SCM Admin Dashboard" />
      

      <div className="p-6 space-y-6">
        {/* Topbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Administrator — SCM</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">Ringkasan performa dan notifikasi penting hari ini.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg px-3 py-2 w-[360px]">
              <Search size={16} className="text-neutral-500" />
              <input className="bg-transparent outline-none text-sm w-full" placeholder="Cari produk, pesanan, pelanggan..." />
            </div>

            {/* Notifikasi */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((s) => !s)}
                className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Notifications"
              >
                <div className="relative">
                  <Bell />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs rounded-full bg-red-600 text-white">
                      {unread}
                    </span>
                  )}
                </div>
              </button>

              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 border dark:border-neutral-800 shadow-lg rounded-lg overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between px-4 py-2 border-b dark:border-neutral-800">
                    <div className="font-medium">Notifikasi</div>
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-neutral-500" onClick={markAllRead}>Tandai semua</button>
                      <button className="text-xs text-neutral-400" onClick={() => setNotifOpen(false)}>Tutup</button>
                    </div>
                  </div>

                  <div className="max-h-64 overflow-auto">
                    {notifications.length === 0 && <div className="p-4 text-sm text-neutral-500">Belum ada notifikasi.</div>}
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex gap-3 px-4 py-3 cursor-pointer ${!n.read ? 'bg-neutral-50 dark:bg-neutral-900/30' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
                        onClick={() => markRead(n.id)}
                      >
                        <div className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 self-start">
                          {n.type === 'success' ? <CheckCircle /> : n.type === 'warning' ? <Clock /> : <Info />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <div className="text-sm font-medium">{n.title}</div>
                            <div className="text-xs text-neutral-400">{n.time}</div>
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-300">{n.body}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

          </div>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-6 shadow-lg overflow-hidden"
        >
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Smart Commerce Management</h2>
              <p className="text-sm text-white/90 mt-1 max-w-xl">Pantau produk, penjualan, dan pengiriman dalam satu tempat. Klik tombol cepat untuk aksi harian.</p>
              <div className="mt-4 flex gap-2">
                <button className="bg-white/20 px-4 py-2 rounded-lg text-sm">Lihat Laporan</button>
                <button className="bg-white/10 px-4 py-2 rounded-lg text-sm">Kelola Produk</button>
              </div>
            </div>

            <div className="mt-4 md:mt-0 text-white/20 text-7xl pointer-events-none">
              <ShoppingCart size={140} />
            </div>
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <GlassCard icon={<ShoppingCart className="text-white" />} label="Total Produk" value="210" meta="12 baru minggu ini" iconBg="from-indigo-500 to-indigo-700" />
          <GlassCard icon={<DollarSign className="text-white" />} label="Pendapatan" value="Rp 32.500.000" meta="Naik 8% vs minggu lalu" iconBg="from-green-500 to-green-700" />
          <GlassCard icon={<Users className="text-white" />} label="Pelanggan Aktif" value="1.240" meta="320 aktif minggu ini" iconBg="from-pink-500 to-pink-700" />
          <GlassCard icon={<Truck className="text-white" />} label="Pengiriman" value="128" meta="12 sedang dikirim" iconBg="from-indigo-400 to-indigo-600" />
        </div>

        {/* Main grid: charts + orders + real-time */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts (span 2) */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Grafik Penjualan & Stok</h3>
              <div className="text-sm text-neutral-500">Minggu ini</div>
            </div>
            <div className="h-56 rounded-md">
              <Line data={chartData} options={chartOptions as any} />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <MiniStat title="Rata-rata Order / Hari" value="24" />
              <MiniStat title="Konversi" value="3.6%" />
              <MiniStat title="Biaya Kirim (avg)" value="Rp 12.500" />
            </div>
          </div>

          {/* Real-time / Activity */}
          <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Truck className="text-indigo-600" />
              <h4 className="font-semibold">Status Pengiriman Real-Time</h4>
            </div>

            <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
              <StatusRow id="A1024" courier="JNE · Truck 12" eta="45m" status="Di jalan" />
              <StatusRow id="A1023" courier="TIKI" eta="—" status="Tertunda" delayed />
              <div className="mt-3 text-xs text-neutral-400">Catatan: Hubungkan WebSocket / Echo untuk update otomatis.</div>
            </div>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Pesanan Terbaru</h3>
            <div className="text-sm text-neutral-500">Menampilkan 10 terbaru</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-neutral-500 dark:text-neutral-400">
                <tr>
                  <th className="py-2">Order</th>
                  <th className="py-2">Pelanggan</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">ETA</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t dark:border-neutral-700">
                    <td className="py-3 font-medium">{o.id}</td>
                    <td className="py-3 text-neutral-600 dark:text-neutral-300">{o.customer}</td>
                    <td className="py-3">{o.total}</td>
                    <td className="py-3"><StatusBadge status={o.status} /></td>
                    <td className="py-3 text-sm text-neutral-500">{o.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end">
            <button className="text-sm text-indigo-600">Lihat semua pesanan →</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

/* ---------- Subcomponents ---------- */

function GlassCard({ icon, label, value, meta, iconBg }: { icon: React.ReactNode; label: string; value: string; meta?: string; iconBg: string }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-md shadow-md border border-neutral-200 dark:border-neutral-700 rounded-2xl p-4 flex items-center gap-4">
      <div className={`p-3 rounded-full bg-gradient-to-br ${iconBg} shadow-sm`}>{icon}</div>
      <div>
        <div className="text-xs text-neutral-600 dark:text-neutral-400">{label}</div>
        <div className="text-xl font-bold">{value}</div>
        {meta && <div className="text-xs text-neutral-500 mt-1">{meta}</div>}
      </div>
    </motion.div>
  );
}

function MiniStat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-900/40 rounded-lg p-3 text-sm text-neutral-700 dark:text-neutral-200">
      <div className="text-xs">{title}</div>
      <div className="font-semibold mt-1">{value}</div>
    </div>
  );
}

function StatusRow({ id, courier, eta, status, delayed }: { id: string; courier: string; eta: string; status: string; delayed?: boolean }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="font-medium">{id}</div>
        <div className="text-xs text-neutral-500">{courier}</div>
      </div>
      <div className="text-right">
        <div className={`text-sm ${delayed ? 'text-red-500' : 'text-neutral-700 dark:text-neutral-200'}`}>{status}</div>
        <div className="text-xs text-neutral-400">{eta}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const classes =
    status === 'Delivered'
      ? 'bg-green-100 text-green-700'
      : status === 'In Transit'
        ? 'bg-indigo-100 text-indigo-700'
        : status === 'Delayed'
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-neutral-100 text-neutral-700';
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${classes}`}>{status}</span>;
}
