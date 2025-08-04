import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Lupa Password" />
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]">
                <div className="w-full max-w-md bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md rounded-2xl shadow-xl p-8 fade-in">

                    {/* Header text */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                            Lupa Password
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Masukkan email Anda untuk menerima link reset password
                        </p>
                    </div>

                    {/* Status sukses */}
                    {status && (
                        <div className="mb-4 text-center text-sm font-medium text-green-600 dark:text-green-400">
                            {status}
                        </div>
                    )}

                    {/* Form lupa password */}
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <Label htmlFor="email" className="text-gray-800 dark:text-gray-200">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="off"
                                autoFocus
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                                className="bg-gray-100 dark:bg-[#1b1b18] border-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* Tombol kirim */}
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-3 transition"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Kirim Link Reset Password
                        </Button>
                    </form>

                    {/* Link ke login */}
                    <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-8">
                        <span>Atau kembali ke </span>
                        <TextLink
                            href={route('login')}
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Halaman Login
                        </TextLink>
                    </div>
                </div>
            </div>
        </>
    );
}
