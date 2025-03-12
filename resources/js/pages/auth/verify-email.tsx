// Components
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.email.send'));
    };

    return (
        <AuthLayout title="Bitte verifizieren" description="Bitte verifizieren Sie Ihre E-Mail-Adresse und Handynummer, um diese Aktion auszuführen.">
            <Head title="E-Mail-Adresse und Handynummer verifizieren" />

            <Link href={route('profile.edit')} className="mx-auto block rounded-md bg-gray-900 px-4 py-2 text-sm text-white">
                Zu den Einstellungen
            </Link>
        </AuthLayout>
    );
}
