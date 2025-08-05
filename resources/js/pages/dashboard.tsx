import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ShoppingCart, DollarSign, Users, Info, Truck, PackageSearch } from 'lucide-react';
import { motion } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'SCM', href: '/dashboard' },
];

export default function Dashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="SCM Dashboard" />

      <div className="p-6 space-y-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-8 shadow-xl overflow-hidden"
        >
          <h1 className="text-4xl font-bold tracking-tight">Smart Commerce Management</h1>
          <p className="mt-2 text-white/90 text-lg max-w-xl">
            Pantau produk, penjualan, dan status pengiriman Anda dalam satu dashboard pintar dan interaktif.
          </p>
          <div className="absolute right-4 bottom-4 opacity-30 text-9xl pointer-events-none">
            <ShoppingCart size={120} />
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <GlassCard
            icon={<ShoppingCart className="text-white" />}
            label="Total Produk"
            value="210 Produk"
            iconBg="from-indigo-500 to-indigo-700"
          />
          <GlassCard
            icon={<DollarSign className="text-white" />}
            label="Total Penjualan"
            value="Rp 32.500.000"
            iconBg="from-green-500 to-green-700"
          />
          <GlassCard
            icon={<Users className="text-white" />}
            label="Pelanggan Aktif"
            value="1.240 Pengguna"
            iconBg="from-pink-500 to-pink-700"
          />
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex gap-4 items-start bg-indigo-50 dark:bg-neutral-900/40 border-l-4 border-indigo-600 dark:border-indigo-400 p-5 rounded-xl shadow-sm"
        >
          <div className="mt-1 text-indigo-600 dark:text-indigo-400">
            <Info />
          </div>
          <div>
            <h2 className="font-semibold text-indigo-900 dark:text-white">Info Bulanan:</h2>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">
              Raih bonus penjualan hingga <span className="font-bold">20%</span> bulan ini jika pengiriman tepat waktu dan stok selalu tersedia!
            </p>
          </div>
        </motion.div>

        {/* Pengiriman Real-time */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <Truck className="text-indigo-600" />
            <h3 className="text-lg font-semibold">Status Pengiriman Real-Time</h3>
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-300">
            Menunggu koneksi ke server pengiriman... <br />
            (Integrasikan dengan WebSocket atau sistem real-time tracking)
          </div>
        </motion.div>

        {/* Grafik / Analitik */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="h-64 bg-white dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-600 rounded-2xl flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-sm"
        >
          Grafik Penjualan & Stok (Integrasikan dengan Chart.js atau Recharts)
        </motion.div>
      </div>
    </AppLayout>
  );
}

// Kartu statistik bergaya kaca
function GlassCard({
  icon,
  label,
  value,
  iconBg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-md shadow-lg border border-neutral-200 dark:border-neutral-700 rounded-2xl p-5 flex gap-4 items-center"
    >
      <div className={`p-3 rounded-full bg-gradient-to-br ${iconBg} shadow-md`}>
        {icon}
      </div>
      <div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">{label}</div>
        <div className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</div>
      </div>
    </motion.div>
  );
}
