import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    CalendarDays,
    Clock,
    Package,
    Truck,
    BarChart,
    Users,
    ArrowRightCircle,
    CheckCircle2,
    Quote,
    ChevronDown
} from 'lucide-react';

export default function LandingPageSCM() {
    const { auth } = usePage<SharedData>().props;

    // Jam & tanggal
    const [time, setTime] = useState<string>(new Date().toLocaleTimeString());
    const [date, setDate] = useState<string>(
        new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    );

    // Counter angka naik
    const [counts, setCounts] = useState({ barang: 0, pengiriman: 0, klien: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleTimeString());
            setDate(
                now.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })
            );
        }, 1000);

        const counter = setInterval(() => {
            setCounts((prev) => {
                if (prev.barang < 1250 || prev.pengiriman < 830 || prev.klien < 96) {
                    return {
                        barang: Math.min(prev.barang + 25, 1250),
                        pengiriman: Math.min(prev.pengiriman + 15, 830),
                        klien: Math.min(prev.klien + 2, 96),
                    };
                }
                clearInterval(counter);
                return prev;
            });
        }, 40);

        return () => {
            clearInterval(timer);
            clearInterval(counter);
        };
    }, []);

    // Fitur utama
    const features = [
        {
            title: 'Manajemen Barang',
            icon: <Package className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
            description: 'Kelola stok barang dengan cepat dan akurat.'
        },
        {
            title: 'Distribusi & Pengiriman',
            icon: <Truck className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
            description: 'Pantau proses distribusi dan pengiriman secara real-time.'
        },
        {
            title: 'Laporan & Analitik',
            icon: <BarChart className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
            description: 'Dapatkan laporan performa SCM yang mendetail.'
        },
        {
            title: 'Kalender Operasional',
            icon: <CalendarDays className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
            description: 'Jadwalkan kegiatan dan pengiriman dengan kalender.'
        }
    ];

    // Paket harga
    const pricingPlans = [
        {
            name: "Starter",
            price: "Rp 99.000 / bulan",
            features: [
                "Maksimal 1.000 barang/bulan",
                "Tracking pengiriman dasar",
                "Akses 1 user",
                "Email support"
            ]
        },
        {
            name: "Pro",
            price: "Rp 249.000 / bulan",
            features: [
                "Maksimal 10.000 barang/bulan",
                "Tracking pengiriman real-time",
                "Akses 5 user",
                "Laporan analitik lengkap",
                "Support prioritas"
            ]
        },
        {
            name: "Enterprise",
            price: "Rp 499.000 / bulan",
            features: [
                "Barang & pengiriman tanpa batas",
                "Fitur premium semua modul",
                "Akses unlimited user",
                "Integrasi API",
                "Support 24/7 VIP"
            ]
        }
    ];

    // Testimonial
    const testimonials = [
        {
            name: "Budi Santoso",
            company: "PT Logistik Jaya",
            text: "Sejak pakai LandingPageSCM, proses distribusi kami jadi lebih efisien dan laporan lebih akurat.",
        },
        {
            name: "Siti Rahma",
            company: "CV Indo Supply",
            text: "User interface-nya simpel tapi powerful. Tim kami jadi lebih produktif!",
        },
        {
            name: "Andi Pratama",
            company: "PT Makmur Abadi",
            text: "Support 24/7-nya luar biasa, selalu ada solusi cepat ketika ada kendala.",
        }
    ];

    // FAQ
    const faqs = [
        {
            q: "Apakah bisa custom sesuai bisnis saya?",
            a: "Ya, paket Enterprise mendukung kustomisasi sesuai kebutuhan bisnis Anda."
        },
        {
            q: "Apakah ada trial gratis?",
            a: "Kami menyediakan trial gratis 14 hari untuk mencoba semua fitur dasar."
        },
        {
            q: "Apakah data saya aman?",
            a: "Kami menggunakan enkripsi dan server yang aman untuk melindungi data Anda."
        }
    ];

    return (
        <>
            <Head title="LandingPageSCM">
                <style>{`
                    html { scroll-behavior: smooth; }
                    .fade-in { animation: fadeIn 1s ease-in-out forwards; }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </Head>

            <div className="flex min-h-screen flex-col text-[#1b1b18] dark:text-[#EDEDEC] bg-gray-50 dark:bg-[#0a0a0a]">
                
                {/* HEADER */}
                <header className="flex justify-between items-center px-10 py-4 shadow-md bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        LandingPageSCM
                    </h1>
                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-5 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2 rounded-lg text-sm hover:bg-indigo-50 dark:hover:bg-[#1b1b18] transition"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* HERO SECTION */}
                <section className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 px-10 lg:px-20 py-20 fade-in">
                    {/* Kiri: Text + CTA */}
                    <div className="flex-1">
                        <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                            Optimalkan <span className="text-indigo-600 dark:text-indigo-400">Supply Chain</span> Anda 🚀
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mb-8">
                            Kelola inventori, distribusi, dan pelaporan dengan mudah. Tingkatkan efisiensi bisnis dan
                            dapatkan insight mendalam yang mendukung pertumbuhan perusahaan Anda.
                        </p>

                        <Link
                            href={route('login')}
                            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full shadow-lg hover:scale-105 transition-all"
                        >
                            Mulai Sekarang
                            <ArrowRightCircle className="w-6 h-6" />
                        </Link>
                    </div>

                    {/* Kanan: Jam Digital & Kalender */}
                    <div className="flex-1 flex justify-center">
                        <div className="flex flex-col items-center bg-white dark:bg-[#121212] px-8 py-10 rounded-2xl shadow-xl w-full max-w-md">
                            <Clock className="w-12 h-12 mb-3 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                            <span className="text-4xl font-bold mb-2">{time}</span>
                            <CalendarDays className="w-10 h-10 mt-4 mb-2 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-lg font-medium">{date}</span>
                        </div>
                    </div>
                </section>

                {/* COUNTER SECTION */}
                <section className="grid grid-cols-3 gap-6 px-10 lg:px-24 text-center py-10 fade-in">
                    <div className="flex flex-col items-center bg-white dark:bg-[#121212] rounded-xl p-6 shadow-md hover:scale-105 transition">
                        <Package className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                        <span className="text-2xl font-bold">{counts.barang}+</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Barang Dikelola</span>
                    </div>
                    <div className="flex flex-col items-center bg-white dark:bg-[#121212] rounded-xl p-6 shadow-md hover:scale-105 transition">
                        <Truck className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                        <span className="text-2xl font-bold">{counts.pengiriman}+</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Pengiriman</span>
                    </div>
                    <div className="flex flex-col items-center bg-white dark:bg-[#121212] rounded-xl p-6 shadow-md hover:scale-105 transition">
                        <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                        <span className="text-2xl font-bold">{counts.klien}+</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Klien Aktif</span>
                    </div>
                </section>

                {/* FEATURES */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-10 lg:px-20 py-16 fade-in">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-start bg-white dark:bg-[#121212] p-6 rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all"
                        >
                            {feature.icon}
                            <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </section>

                {/* PRICING */}
                <section className="px-10 lg:px-20 py-20 bg-indigo-50 dark:bg-[#121212] fade-in">
                    <h3 className="text-3xl font-bold text-center mb-10 text-indigo-700 dark:text-indigo-400">
                        Pilih Paket Sesuai Kebutuhan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                        {pricingPlans.map((plan, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-xl hover:scale-105 transition"
                            >
                                <h4 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">{plan.name}</h4>
                                <p className="text-2xl font-extrabold mb-6">{plan.price}</p>
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                            <CheckCircle2 className="w-5 h-5 text-indigo-500" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={route('login')}
                                    className="mt-auto inline-flex justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Mulai Sekarang
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* TESTIMONIAL */}
                <section className="px-10 lg:px-20 py-20 fade-in bg-white dark:bg-[#0a0a0a]">
                    <h3 className="text-3xl font-bold text-center mb-12 text-indigo-600 dark:text-indigo-400">
                        Apa Kata Mereka
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="bg-indigo-50 dark:bg-[#121212] p-8 rounded-xl shadow-lg relative">
                                <Quote className="w-8 h-8 text-indigo-400 absolute -top-4 -left-4" />
                                <p className="text-gray-700 dark:text-gray-300 mb-6">{t.text}</p>
                                <div className="font-semibold text-indigo-700 dark:text-indigo-300">{t.name}</div>
                                <div className="text-sm text-gray-500">{t.company}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ */}
                <section className="px-10 lg:px-20 py-20 fade-in bg-indigo-50 dark:bg-[#121212]">
                    <h3 className="text-3xl font-bold text-center mb-12 text-indigo-700 dark:text-indigo-400">
                        Pertanyaan yang Sering Diajukan
                    </h3>
                    <div className="max-w-4xl mx-auto space-y-6">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#0a0a0a] rounded-xl shadow-md p-6">
                                <div className="flex justify-between items-center cursor-pointer">
                                    <h4 className="font-semibold">{faq.q}</h4>
                                    <ChevronDown className="w-5 h-5 text-indigo-500" />
                                </div>
                                <p className="mt-3 text-gray-600 dark:text-gray-300">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA CLOSING */}
                <section className="px-10 lg:px-20 py-20 text-center fade-in">
                    <h3 className="text-3xl font-bold mb-6">
                        Siap Optimalkan Bisnis Anda? 🚀
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        Bergabung sekarang dan nikmati kemudahan dalam mengelola supply chain!
                    </p>
                    <Link
                        href={route('register')}
                        className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full shadow-lg hover:scale-105 transition-all"
                    >
                        Daftar Gratis Sekarang
                        <ArrowRightCircle className="w-6 h-6" />
                    </Link>
                </section>

                {/* FOOTER */}
                <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t">
                    © {new Date().getFullYear()} LandingPageSCM. All rights reserved.
                </footer>
            </div>
        </>
    );
}
