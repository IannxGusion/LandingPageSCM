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
    ArrowRightCircle
} from 'lucide-react';

export default function LandingPageSCM() {
    const { auth } = usePage<SharedData>().props;

    // State Jam & tanggal
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

    // Features
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

    return (
        <>
            <Head title="LandingPageSCM">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col text-[#1b1b18] dark:text-[#EDEDEC] bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0a0a0a] dark:to-[#121212]">
                
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
                <section className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 px-10 lg:px-20 py-20">
                    {/* Kiri: Text + CTA */}
                    <div className="flex-1 animate-fade-in">
                        <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                            Tingkatkan <span className="text-indigo-600 dark:text-indigo-400">Supply Chain</span> Anda 🚀
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mb-8">
                            Kelola inventori, distribusi, dan pelaporan dengan mudah. 
                            Tingkatkan efisiensi dan dapatkan insight mendalam yang mendukung pertumbuhan bisnis Anda.
                        </p>

                        <Link
                            href={route('login')}
                            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold bg-indigo-600 text-white rounded-full shadow-lg hover:scale-105 hover:bg-indigo-700 transition-all"
                        >
                            Mulai Sekarang
                            <ArrowRightCircle className="w-6 h-6" />
                        </Link>
                    </div>

                    {/* Kanan: Jam Digital & Kalender */}
                    <div className="flex-1 flex justify-center animate-slide-up">
                        <div className="flex flex-col items-center bg-white dark:bg-[#121212] px-8 py-10 rounded-2xl shadow-xl w-full max-w-md">
                            <Clock className="w-12 h-12 mb-3 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                            <span className="text-4xl font-bold mb-2">{time}</span>
                            <CalendarDays className="w-10 h-10 mt-4 mb-2 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-lg font-medium">{date}</span>
                        </div>
                    </div>
                </section>

                {/* COUNTER SECTION */}
                <section className="grid grid-cols-3 gap-6 px-10 lg:px-24 text-center py-10">
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
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-10 lg:px-20 py-16">
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

                {/* FOOTER */}
                <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t">
                    © {new Date().getFullYear()} LandingPageSCM. All rights reserved.
                </footer>
            </div>
        </>
    );
}
