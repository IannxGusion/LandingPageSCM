import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  ShoppingCart,
  DollarSign,
  Users,
  Truck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const breadcrumbs: BreadcrumbItem[] = [{ title: 'SCM', href: '/dashboard' }];

// Definisikan tipe untuk Order dan Item-nya
type OrderItem = {
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
  items: OrderItem[];
};

// Fungsi untuk baca orders dari localStorage
function readOrders(): Order[] {
  try {
    const raw = localStorage.getItem('scm_orders');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const data = readOrders();
    setOrders(data.reverse());
  }, []);

  // Hitung statistik
  const totalProduk = orders.reduce((t, o) => t + o.items.length, 0);
  const totalPendapatan = orders.reduce((t, o) => t + o.totalInt, 0);
  const totalPelanggan = new Set(orders.map((o) => o.kontak)).size;
  const totalPengiriman = orders.length;

  // Data untuk grafik
  const chartData: ChartData<'line'> = {
    labels: orders.map((o) => o.tanggal),
    datasets: [
      {
        label: 'Total Order',
        data: orders.map((o) => o.totalInt),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="SCM Admin Dashboard" />
      <div className="p-6 space-y-6">
        {/* Header Selamat Datang */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold">Selamat datang di SCM Dashboard</h2>
          <p className="text-sm text-white/80 mt-1">Pantau pengiriman, produk, dan pelanggan Anda secara real-time.</p>
        </motion.div>

        {/* Kartu statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <GlassCard icon={<ShoppingCart className="text-white" />} label="Total Produk" value={totalProduk.toString()} iconBg="from-indigo-500 to-indigo-700" />
          <GlassCard icon={<DollarSign className="text-white" />} label="Pendapatan" value={`Rp ${totalPendapatan.toLocaleString()}`} iconBg="from-green-500 to-green-700" />
          <GlassCard icon={<Users className="text-white" />} label="Pelanggan Aktif" value={totalPelanggan.toString()} iconBg="from-pink-500 to-pink-700" />
          <GlassCard icon={<Truck className="text-white" />} label="Pengiriman" value={totalPengiriman.toString()} iconBg="from-indigo-400 to-indigo-600" />
        </div>

        {/* Grafik dan Status Pengiriman */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Grafik Total Order</h3>
              <div className="text-sm text-neutral-500">Berdasarkan waktu checkout</div>
            </div>
            <div className="h-56 rounded-md">
              <Line data={chartData} options={chartOptions} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-2xl p-4 shadow-sm"
          >
            <h3 className="font-semibold mb-2">Status Pengiriman Real-Time</h3>
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <StatusRow key={order.id} id={order.id} courier={order.lokasi} eta={order.tanggal} status={order.status} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Pesanan Terbaru */}
        <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Pesanan Terbaru</h3>
            <div className="text-sm text-neutral-500">Menampilkan 10 terbaru</div>
          </div>

          <div className="grid gap-3">
            {orders.length === 0 && (
              <div className="text-sm text-neutral-500">Belum ada pesanan.</div>
            )}

            {orders.slice(0, 10).map((o, i) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-neutral-900/40 shadow-sm border border-neutral-100 dark:border-neutral-700"
              >
                <StatusRow id={o.id} courier={o.kontak} eta={o.tanggal} status={o.status} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function GlassCard({ icon, label, value, meta, iconBg }: { icon: React.ReactNode; label: string; value: string; meta?: string; iconBg: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -6 }}
      className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-md shadow-md border border-neutral-200 dark:border-neutral-700 rounded-2xl p-4 flex items-center gap-4"
    >
      <div className={`p-3 rounded-full bg-gradient-to-br ${iconBg} shadow-sm`}>{icon}</div>
      <div>
        <div className="text-xs text-neutral-600 dark:text-neutral-400">{label}</div>
        <div className="text-xl font-bold">{value}</div>
        {meta && <div className="text-xs text-neutral-500 mt-1">{meta}</div>}
      </div>
    </motion.div>
  );
}

function StatusRow({ id, courier, eta, status }: { id: string; courier: string; eta: string; status: string }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="font-medium">{id}</div>
        <div className="text-xs text-neutral-500">{courier}</div>
      </div>
      <div className="text-right">
        <div className="text-sm text-neutral-700 dark:text-neutral-200">{status}</div>
        <div className="text-xs text-neutral-400">{eta}</div>
      </div>
    </div>
  );
}
