import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Verifikasi Email" />
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]">
                <div className="w-full max-w-md bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md rounded-2xl shadow-xl p-8 fade-in">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                            Verifikasi Email Anda
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Kami telah mengirimkan link verifikasi ke email Anda.  
                            Silakan cek kotak masuk Anda untuk memverifikasi akun.
                        </p>
                    </div>

                    {/* Status */}
                    {status === 'verification-link-sent' && (
                        <div className="mb-4 text-center text-sm font-medium text-green-600 dark:text-green-400">
                            Link verifikasi baru telah dikirim ke email Anda.
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-6 text-center">
                        <Button
                            disabled={processing}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-3 transition"
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Kirim Ulang Email Verifikasi
                        </Button>

                        <TextLink
                            href={route('logout')}
                            method="post"
                            className="mx-auto block text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Keluar
                        </TextLink>
                    </form>
                </div>
            </div>
        </>
    );
}
