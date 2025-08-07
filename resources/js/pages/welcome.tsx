/* LandingPageSCM.tsx */
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { JSX, useEffect, useMemo, useState } from 'react';
import {
  Package,
  Truck,
  BarChart2,
  Users,
  ShoppingCart,
  MessageCircle,
  X
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

declare const route: any; // agar route('login') tidak error di TS (sesuaikan dengan proyekmu)

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  priceText?: string;
  img: string;
  badge?: string | null;
  desc?: string;
};

export default function LandingPageSCM(): JSX.Element {
  const { auth } = usePage<SharedData>().props;

  // reduced motion
  const shouldReduceMotion = useReducedMotion();

  // jam & tanggal realtime
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());
  const [date, setDate] = useState<string>(
    new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  );
  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
      setDate(now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // sample products (ganti ke asset lokal jika perlu)
  const products: Product[] = [
    { id: 1, name: 'Wireless Gaming Mouse X5', category: 'Mouse', price: 150000, priceText: 'Rp 150.000', img: '13.jpeg', badge: 'Bestseller', desc: 'Sensor presisi, ergonomis untuk jam panjang.' },
    { id: 2, name: 'Mechanical Keyboard K87', category: 'Keyboard', price: 350000, priceText: 'Rp 350.000', img: '7.jpeg', badge: null, desc: 'Switch taktil, build solid.' },
    { id: 3, name: 'Monitor 24" FHD 144Hz', category: 'Monitor', price: 2500000, priceText: 'Rp 2.500.000', img: '1.jpeg', badge: 'Hot', desc: 'IPS 144Hz — smooth & vivid.' },
    { id: 4, name: 'Ergo Workstation Desk', category: 'Meja', price: 1200000, priceText: 'Rp 1.200.000', img: '22.jpeg', badge: 'Value', desc: 'Adjustable, cable management.' },
    { id: 5, name: '1TB NVMe SSD', category: 'SSD', price: 800000, priceText: 'Rp 800.000', img: '19.jpeg', badge: null, desc: 'Boot & load lebih cepat.' },
    { id: 6, name: 'All-in-One Printer P200', category: 'Printer', price: 1500000, priceText: 'Rp 1.500.000', img: '4.jpeg', badge: null, desc: 'Wi-Fi, duplex, hemat tinta.' },
    { id: 7, name: 'Headset Gaming H7', category: 'Headset', price: 750000, priceText: 'Rp 750.000', img: '16.jpeg', badge: 'Disc 10%', desc: 'Surround, mic noise-canceling.' },
    { id: 8, name: 'Kursi Kantor ErgoSeat', category: 'Kursi', price: 2000000, priceText: 'Rp 2.000.000', img: '19.jpeg', badge: 'Premium', desc: 'Ergonomis & adjustable.' },
  ];

  // show only bestseller/hot/value (max 4); fill if kurang
  const bestsellerProducts = useMemo(() => {
    const filtered = products.filter(p => p.badge && ['Bestseller', 'Hot', 'Value'].includes(p.badge));
    const take = filtered.slice(0, 4);
    if (take.length < 4) {
      const others = products.filter(p => !filtered.includes(p)).slice(0, 4 - take.length);
      return [...take, ...others];
    }
    return take;
  }, [products]);

  // small counters
  const [counters, setCounters] = useState({ produk: 0, pesanan: 0, pelanggan: 0 });
  useEffect(() => {
    let mounted = true;
    const interval = setInterval(() => {
      if (!mounted) return;
      setCounters(prev => {
        if (prev.produk < bestsellerProducts.length || prev.pesanan < 120 || prev.pelanggan < 80) {
          return {
            produk: Math.min(prev.produk + 1, bestsellerProducts.length),
            pesanan: Math.min(prev.pesanan + 6, 120),
            pelanggan: Math.min(prev.pelanggan + 4, 80),
          };
        }
        clearInterval(interval);
        return prev;
      });
    }, 60);
    return () => { mounted = false; clearInterval(interval); };
  }, [bestsellerProducts.length]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  function handleBuy(p: Product) {
    if (!auth?.user) {
      window.location.href = route('login');
      return;
    }
    setSelectedProduct(p);
  }

  const [fabOpen, setFabOpen] = useState(false);

  const formatPrice = (v: number) => v.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

  /* framer-motion variants (typed as any to avoid TS strict errors) */
  const container: any = shouldReduceMotion ? undefined : {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, when: 'beforeChildren' } }
  };
  const fadeUp: any = shouldReduceMotion ? undefined : {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: 'easeOut' } }
  };
  const pop: any = shouldReduceMotion ? undefined : {
    hidden: { opacity: 0, scale: 0.98 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.34 } }
  };

  return (
    <>
      <Head title="LandingPageSCM — Toko Elektronik" />
      <div className="min-h-screen bg-white dark:bg-[#071018] text-slate-900 dark:text-slate-100 font-sans">

        {/* HEADER */}
        <header className="sticky top-0 z-40 bg-transparent backdrop-blur">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="text-xl font-semibold text-indigo-600">LandingPageSCM</div>
            <nav className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
              <a href="#fitur" className="hover:underline">Fitur</a>
              <a href="#produk" className="hover:underline">Produk</a>
              {auth?.user ? (
                <Link href={route('dashboard')} className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm">Dashboard</Link>
              ) : (
                <>
                  <Link href={route('login')} className="px-3 py-2 rounded-md border">Log in</Link>
                  <Link href={route('register')} className="px-3 py-2 rounded-md bg-indigo-600 text-white">Register</Link>
                </>
              )}
            </nav>
          </div>
        </header>

        {/* HERO */}
        <motion.section
          {...(container ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 }, variants: container } : {})}
          className="bg-gradient-to-r from-indigo-600 to-sky-500 dark:from-indigo-800 dark:to-slate-900"
        >
          <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-8">
            <motion.div {...(fadeUp ? { variants: fadeUp } : {})} className="flex-1 text-white">
              <h1 className="text-3xl lg:text-4xl font-extrabold mb-3">Perangkat Elektronik & Aksesoris untuk Kerja & Gaming</h1>
              <p className="text-indigo-100 max-w-lg mb-6">Kurasi mouse, keyboard, monitor, SSD, headset, printer, meja & kursi — garansi resmi, packing aman, pengiriman cepat.</p>
              <div className="flex gap-3">
                <a href="#produk" className="px-5 py-3 rounded-full bg-white text-indigo-700 font-semibold">Lihat Bestseller</a>
                <Link href={route('register')} className="px-5 py-3 rounded-full border border-white/30 text-white">Daftar</Link>
              </div>
            </motion.div>

            <motion.div {...(container ? { variants: container } : {})} className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
              {bestsellerProducts.slice(0, 4).map((p) => (
                <motion.div key={p.id} {...(pop ? { variants: pop } : {})} className="bg-white/90 rounded-xl overflow-hidden shadow-sm">
                  <img src={p.img} alt={p.name} className="w-full h-36 object-cover" />
                  <div className="p-3">
                    <div className="font-semibold text-sm text-slate-800">{p.name}</div>
                    <div className="text-indigo-600 font-bold text-sm mt-1">{p.priceText ?? formatPrice(p.price)}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* FEATURES */}
        <motion.section
          id="fitur"
          {...(container ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 }, variants: container } : {})}
          className="max-w-6xl mx-auto px-6 py-12"
        >
          <motion.div {...(fadeUp ? { variants: fadeUp } : {})} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Feature icon={<Package className="w-6 h-6 text-indigo-600" />} title="Katalog Kurasi" text="Hanya produk teruji & populer, deskripsi teknis lengkap." />
            <Feature icon={<Truck className="w-6 h-6 text-indigo-600" />} title="Pengiriman Aman" text="Packing khusus, tracking, dan opsi express." />
            <Feature icon={<BarChart2 className="w-6 h-6 text-indigo-600" />} title="Garansi Resmi" text="Garansi 3–36 bulan sesuai brand." />
            <Feature icon={<Users className="w-6 h-6 text-indigo-600" />} title="Support After-Sales" text="Panduan setup & proses retur mudah." />
          </motion.div>
        </motion.section>

        {/* PRODUCTS */}
        <motion.section
          id="produk"
          {...(container ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 }, variants: container } : {})}
          className="max-w-6xl mx-auto px-6 py-12 bg-white dark:bg-[#071018] rounded-t-2xl"
        >
          <motion.div {...(fadeUp ? { variants: fadeUp } : {})} className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Bestseller</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">Produk terpopuler pilihan pelanggan.</p>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">{bestsellerProducts.length} items</div>
          </motion.div>

          <motion.div {...(container ? { variants: container } : {})} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellerProducts.map((p) => (
              <motion.article
                key={p.id}
                {...(fadeUp ? { variants: fadeUp } : {})}
                className="bg-white dark:bg-[#0b0b0b] rounded-xl shadow-md overflow-hidden flex flex-col
                           transition transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg duration-300"
              >
                <div className="relative">
                  <img src={p.img} alt={p.name} className="w-full h-44 object-cover" />
                  {p.badge && <div className="absolute left-3 top-3 bg-indigo-600 text-white px-2 py-1 text-xs rounded">{p.badge}</div>}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{p.name}</h3>
                    <div className="text-indigo-600 font-bold text-sm">{p.priceText ?? formatPrice(p.price)}</div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{p.desc}</p>

                  <div className="mt-auto flex gap-2">
                    <button onClick={() => handleBuy(p)} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white">
                      <ShoppingCart className="w-4 h-4" /> Beli
                    </button>
                    <button onClick={() => setSelectedProduct(p)} className="px-3 py-2 rounded-lg border">Detail</button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* jam & tanggal */}
          <motion.div {...(fadeUp ? { variants: fadeUp } : {})} className="mt-10 text-center">
            <div className="text-2xl font-semibold">{time}</div>
            <div className="text-sm text-slate-500">{date}</div>
          </motion.div>
        </motion.section>

        {/* BUNDLES */}
        <motion.section
          {...(container ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 }, variants: container } : {})}
          className="max-w-6xl mx-auto px-6 py-12"
        >
          <motion.h3 {...(fadeUp ? { variants: fadeUp } : {})} className="text-xl font-bold mb-4">Paket Populer</motion.h3>
          <motion.div {...(container ? { variants: container } : {})} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div {...(fadeUp ? { variants: fadeUp } : {})}><SimpleBundle name="Starter Kit" price="Rp 499.000" items={['Mouse', 'Keyboard']} /></motion.div>
            <motion.div {...(fadeUp ? { variants: fadeUp } : {})}><SimpleBundle name="Workstation Pro" price="Rp 3.499.000" items={['Monitor', 'Keyboard', 'Mouse']} highlight /></motion.div>
            <motion.div {...(fadeUp ? { variants: fadeUp } : {})}><SimpleBundle name="Gaming Pack" price="Rp 3.299.000" items={['Headset', 'Mouse', 'Keyboard']} /></motion.div>
          </motion.div>
        </motion.section>

        {/* TESTIMONIALS */}
        <motion.section
          {...(container ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 }, variants: container } : {})}
          className="max-w-6xl mx-auto px-6 py-12"
        >
          <motion.h3 {...(fadeUp ? { variants: fadeUp } : {})} className="text-xl font-bold mb-4">Apa kata pelanggan</motion.h3>
          <motion.div {...(container ? { variants: container } : {})} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div {...(fadeUp ? { variants: fadeUp } : {})}><Testimonial name="Doni" text="Monitor dan keyboardnya mantap. Setup jadi rapi." /></motion.div>
            <motion.div {...(fadeUp ? { variants: fadeUp } : {})}><Testimonial name="Fina" text="Workstation Pro hemat & instalasinya cepat." /></motion.div>
            <motion.div {...(fadeUp ? { variants: fadeUp } : {})}><Testimonial name="Arief" text="Mouse responsif & pengiriman aman." /></motion.div>
          </motion.div>
        </motion.section>

        {/* CTA */}
        <motion.section {...(fadeUp ? { variants: fadeUp } : {})} className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-bold">Siap upgrade setup-mu?</h4>
              <div className="text-sm mt-1">Daftar sekarang & dapatkan promo bundling.</div>
            </div>
            <div className="flex gap-3">
              <Link href={route('register')} className="px-5 py-2 rounded-full bg-white text-indigo-700 font-semibold">Daftar</Link>
              <a href="#produk" className="px-5 py-2 rounded-full border border-white/40">Lihat</a>
            </div>
          </div>
        </motion.section>

        {/* FOOTER */}
        <motion.footer {...(fadeUp ? { variants: fadeUp } : {})} className="bg-slate-900 text-slate-300">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="text-white font-bold">LandingPageSCM</div>
              <div className="text-sm text-slate-400">Toko Elektronik — kurasi, garansi resmi, pengiriman aman.</div>
            </div>
            <div className="text-sm text-slate-400">support@tokokamu.example • +62 812 3456 7890</div>
          </div>
          <div className="border-t border-slate-800/60 text-center py-3 text-sm text-slate-500">© {new Date().getFullYear()} LandingPageSCM</div>
        </motion.footer>

        {/* PRODUCT MODAL */}
        {selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.25 }} className="bg-white dark:bg-[#0b0b0b] w-full max-w-2xl rounded-xl overflow-hidden shadow-lg">
              <div className="flex items-start justify-between p-4 border-b dark:border-neutral-800">
                <div>
                  <div className="font-bold text-lg">{selectedProduct.name}</div>
                  <div className="text-sm text-slate-500">{selectedProduct.category}</div>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-[#111]"><X /></button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-64 object-cover rounded-md" />
                <div className="flex flex-col">
                  <div className="text-indigo-600 font-bold text-2xl">{selectedProduct.priceText ?? formatPrice(selectedProduct.price)}</div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-3">{selectedProduct.desc}</p>
                  <div className="mt-auto flex gap-3">
                    <button
                      onClick={() => {
                      window.location.href = route('login');
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                      Login untuk Beli
                    </button>
                    <button onClick={() => setSelectedProduct(null)} className="px-4 py-2 rounded-md border">Tutup</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* FAB */}
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.28 }} className="fixed right-6 bottom-6 z-50">
          <div className="flex flex-col items-end gap-3">
            <button onClick={() => setFabOpen(!fabOpen)} className="w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:scale-105 transition">
              <MessageCircle className="w-6 h-6" />
            </button>

            {fabOpen && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-2 w-64 bg-white dark:bg-[#0b0b0b] rounded-xl shadow-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">Butuh Bantuan?</div>
                  <button onClick={() => setFabOpen(false)} className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-[#111]"><X /></button>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 mb-3">Chat, cek promo, atau daftar cepat.</div>
                <div className="flex gap-2">
                  <Link href={route('register')} className="flex-1 px-3 py-2 rounded-md bg-indigo-600 text-white text-center">Daftar</Link>
                  <a href="#produk" className="px-3 py-2 rounded-md border">Produk</a>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* ---------------- Subcomponents ---------------- */

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-4 bg-white dark:bg-[#0b0b0b] p-4 rounded-lg shadow
                    transition transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg duration-300">
      <div className="p-2 rounded-md bg-indigo-50 dark:bg-indigo-900">{icon}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-slate-500 dark:text-slate-300 mt-1">{text}</div>
      </div>
    </div>
  );
}

function SimpleBundle({ name, price, items, highlight = false }: { name: string; price: string; items: string[]; highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-xl shadow transition transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg duration-300 ${highlight ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white' : 'bg-white dark:bg-[#0b0b0b]'}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className={`font-semibold ${highlight ? 'text-white' : ''}`}>{name}</div>
          <div className={`text-sm mt-1 ${highlight ? 'text-indigo-100' : 'text-slate-500'}`}>Items: {items.join(', ')}</div>
        </div>
        <div className="font-bold">{price}</div>
      </div>
      <div className="mt-3">
        <a href="#produk" className={`inline-block px-3 py-2 rounded-md ${highlight ? 'bg-white text-indigo-700' : 'bg-indigo-600 text-white'}`}>{highlight ? 'Best Value' : 'Pilih Paket'}</a>
      </div>
    </div>
  );
}

function Testimonial({ name, text }: { name: string; text: string }) {
  return (
    <div className="bg-white dark:bg-[#0b0b0b] p-4 rounded-xl shadow
                    transition transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 font-bold">{name.charAt(0)}</div>
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">{text}</div>
        </div>
      </div>
    </div>
  );
}
