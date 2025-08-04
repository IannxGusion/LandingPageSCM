import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TextLink from '@/components/text-link';

interface ResetPasswordProps {
    token: string;
    email: string;
}

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset Password" />
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]">
                <div className="w-full max-w-md bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md rounded-2xl shadow-xl p-8 fade-in">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                            Atur Ulang Password
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Silakan masukkan password baru Anda
                        </p>
                    </div>

                    {/* Form Reset Password */}
                    <form onSubmit={submit} className="space-y-6">
                        {/* Email (readonly) */}
                        <div>
                            <Label htmlFor="email" className="text-gray-800 dark:text-gray-200">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                readOnly
                                className="bg-gray-100 dark:bg-[#1b1b18] border-none"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Password */}
                        <div>
                            <Label htmlFor="password" className="text-gray-800 dark:text-gray-200">
                                Password Baru
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="bg-gray-100 dark:bg-[#1b1b18] border-none focus:ring-2 focus:ring-indigo-500"
                                autoFocus
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <Label htmlFor="password_confirmation" className="text-gray-800 dark:text-gray-200">
                                Konfirmasi Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="••••••••"
                                className="bg-gray-100 dark:bg-[#1b1b18] border-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-3 transition"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Simpan Password
                        </Button>
                    </form>

                    {/* Back to login */}
                    <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-8">
                        <TextLink href={route('login')} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                            Kembali ke Halaman Login
                        </TextLink>
                    </div>
                </div>
            </div>
        </>
    );
}
