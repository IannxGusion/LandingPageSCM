import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]">
                <div className="w-full max-w-md bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md rounded-2xl shadow-xl p-8 fade-in">
                    
                    {/* Header text */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                            Selamat Datang Kembali 
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Masuk untuk melanjutkan ke Dashboard SCM
                        </p>
                    </div>

                    {/* Status success */}
                    {status && (
                        <div className="mb-4 text-center text-sm font-medium text-green-600 dark:text-green-400">
                            {status}
                        </div>
                    )}

                    {/* Form login */}
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <Label htmlFor="email" className="text-gray-800 dark:text-gray-200">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                                className="bg-gray-100 dark:bg-[#1b1b18] border-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-gray-800 dark:text-gray-200">
                                    Password
                                </Label>
                                {canResetPassword && (
                                    <TextLink
                                        href={route('password.request')}
                                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                    >
                                        Lupa password?
                                    </TextLink>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="bg-gray-100 dark:bg-[#1b1b18] border-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                tabIndex={3}
                                className="data-[state=checked]:bg-indigo-500 border-gray-300"
                            />
                            <Label htmlFor="remember" className="text-gray-800 dark:text-gray-200">
                                Ingat saya
                            </Label>
                        </div>

                        {/* Button */}
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-3 transition"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Masuk
                        </Button>
                    </form>

                    {/* Link ke register */}
                    <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-8">
                        Belum punya akun?{' '}
                        <TextLink
                            href={route('register')}
                            tabIndex={5}
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Daftar sekarang
                        </TextLink>
                    </div>
                </div>
            </div>
        </>
    );
}
