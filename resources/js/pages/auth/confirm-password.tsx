import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<{ password: string }>>({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Konfirmasi Password" />
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]">
                <div className="w-full max-w-md bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md rounded-2xl shadow-xl p-8 fade-in">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                            Konfirmasi Password
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Ini adalah area aman dari aplikasi.  
                            Silakan masukkan password Anda sebelum melanjutkan.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-gray-800 dark:text-gray-200">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                value={data.password}
                                autoFocus
                                onChange={(e) => setData('password', e.target.value)}
                                className="bg-gray-100 dark:bg-[#1b1b18] border-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-3 transition"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Konfirmasi Password
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
