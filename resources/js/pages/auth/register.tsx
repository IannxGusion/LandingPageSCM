import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onSuccess: () => {
                reset('password', 'password_confirmation');
                setSuccessMessage('Akun berhasil dibuat. Silakan login untuk melanjutkan.');
            },
        });
    };

    return (
        <>
            <Head title="Register" />
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]">
                <div className="w-full max-w-md bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md rounded-2xl shadow-xl p-8 fade-in">

                    {/* Header text */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                            Buat Akun Baru
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Isi data berikut untuk mendaftar
                        </p>
                    </div>

                    {/* Success message */}
                    {successMessage && (
                        <div className="mb-4 text-center text-sm font-medium text-green-600 dark:text-green-400">
                            {successMessage}
                        </div>
                    )}

                    {/* Form register */}
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <Label htmlFor="name" className="text-gray-800 dark:text-gray-200">
                                Nama Lengkap
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nama lengkap"
                                className="bg-gray-100 dark:bg-[#1b1b18] border-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-gray-800 dark:text-gray-200">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                                className="bg-gray-100 dark:bg-[#1b1b18] border-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-gray-800 dark:text-gray-200">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="bg-gray-100 dark:bg-[#1b1b18] border-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div>
                            <Label htmlFor="password_confirmation" className="text-gray-800 dark:text-gray-200">
                                Konfirmasi Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="••••••••"
                                className="bg-gray-100 dark:bg-[#1b1b18] border-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        {/* Button */}
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-3 transition"
                            tabIndex={5}
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Daftar
                        </Button>
                    </form>

                    {/* Link ke login */}
                    <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-8">
                        Sudah punya akun?{' '}
                        <TextLink
                            href={route('login')}
                            tabIndex={6}
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Login sekarang
                        </TextLink>
                    </div>
                </div>
            </div>
        </>
    );
}
