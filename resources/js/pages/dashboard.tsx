import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { motion } from 'framer-motion';
import {
  Truck, Package, FileText, Warehouse, ClipboardList, ArrowRight
} from 'lucide-react';

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
    className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 rounded-2xl shadow-md flex items-center gap-4"
  >
    <div className="p-3 bg-white/20 rounded-full">
      {icon}
    </div>
    <div>
      <div className="text-sm opacity-80">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </motion.div>
);

const DataRow = ({ title, subtitle, right, icon }: { title: string, subtitle: string, right: string, icon: React.ReactNode }) => (
  <div className="flex items-center justify-between p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition rounded-xl border border-neutral-200 dark:border-neutral-700">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
        {icon}
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-neutral-500">{subtitle}</div>
      </div>
    </div>
    <div className="text-sm text-neutral-500">{right}</div>
  </div>
);

export default function DashboardSCM() {
  return (
    <AppLayout breadcrumbs={[{ title: 'SCM', href: '/dashboard' }]}>
      <Head title="Dashboard SCM" />
      <div className="p-6 space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-blue-700 text-white p-6 rounded-2xl shadow-lg"
        >
          <h1 className="text-3xl font-bold mb-2">Supply Chain Dashboard</h1>
          <p className="text-white/80">Pantau alur produk, gudang, dan dokumen pengiriman Anda secara real-time.</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard icon={<Package className="w-6 h-6" />} label="Jumlah Produk" value="245" />
          <StatCard icon={<Warehouse className="w-6 h-6" />} label="Stok Gudang" value="12.430 item" />
          <StatCard icon={<Truck className="w-6 h-6" />} label="Pengiriman Aktif" value="5" />
          <StatCard icon={<FileText className="w-6 h-6" />} label="Total Dokumen" value="97" />
        </div>

        {/* 2 Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pengiriman Terbaru */}
          <section className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Truck className="text-blue-500" /> Pengiriman Terbaru
            </h2>
            <div className="space-y-3">
              <DataRow title="SHIP-2311" subtitle="Gudang A" right="2 jam lalu" icon={<Truck />} />
              <DataRow title="SHIP-2310" subtitle="Gudang B" right="Kemarin" icon={<Truck />} />
              <DataRow title="SHIP-2309" subtitle="Gudang C" right="2 hari lalu" icon={<Truck />} />
            </div>
          </section>

          {/* Dokumen SCM */}
          <section className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ClipboardList className="text-blue-500" /> Dokumen Terbaru
            </h2>
            <div className="space-y-3">
              <DataRow title="PO #INV-1023" subtitle="Purchase Order" right="1 jam lalu" icon={<FileText />} />
              <DataRow title="SJ #203" subtitle="Surat Jalan" right="Hari ini" icon={<FileText />} />
              <DataRow title="INV #2112" subtitle="Invoice" right="Kemarin" icon={<FileText />} />
            </div>
          </section>

        </div>
      </div>
    </AppLayout>
  );
}
