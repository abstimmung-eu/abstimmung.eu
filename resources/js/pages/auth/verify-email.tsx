import AuthLayout from '@/layouts/auth-layout';
import { Head, Link } from '@inertiajs/react';

export default function VerifyEmail() {
    return (
        <AuthLayout title="Bitte verifizieren" description="Bitte verifizieren Sie Ihre E-Mail-Adresse und Handynummer, um diese Aktion auszuführen.">
            <Head title="E-Mail-Adresse und Handynummer verifizieren" />

            <Link href={route('profile.edit')} className="mx-auto block rounded-md bg-gray-900 px-4 py-2 text-sm text-white">
                Zu den Einstellungen
            </Link>
        </AuthLayout>
    );
}
