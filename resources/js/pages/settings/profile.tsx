import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

interface ProfileForm {
    username: string;
    email: string;
    phone: string;
}

interface TokenForm {
    token: string;
}

export default function Profile({ status }: { status?: string }) {

    const { auth } = usePage<SharedData>().props;
    const [phoneOtp, setPhoneOtp] = useState('');

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        username: auth.user.username,
        email: auth.user.email,
        phone: auth.user.phone,
    });

    const {
        data: tokenData,
        setData: setTokenData,
        post,
    } = useForm<Required<TokenForm>>({
        token: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const submitEmailOtp: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('submitEmailOtp', tokenData);

        post(route('verification.email.verify'), {
            preserveScroll: true,
        });
    };

    const submitPhoneOtp: FormEventHandler = (e) => {
        e.preventDefault();

        // Submit the phone OTP verification
        patch(route('verification.phone.verify', tokenData), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profilinformationen" description="Aktualisieren Sie Ihre Benutzerinformationen" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Benutzername</Label>

                            <Input
                                id="username"
                                className="mt-1 block w-full"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                autoComplete="username"
                                placeholder="Benutzername"
                            />

                            <InputError className="mt-2" message={errors.username} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">E-Mail-Adresse</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {status === 'email-verified' && (
                            <div className="mt-4 space-y-3">
                                <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-600">
                                    Ihre E-Mail-Adresse wurde erfolgreich verifiziert.
                                </div>
                            </div>
                        )}

                        {status === 'email-verification-failed' && (
                            <div className="mt-4 space-y-3">
                                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
                                    Ihre E-Mail-Adresse wurde nicht verifiziert.
                                </div>
                            </div>
                        )}

                        {auth.user.email_verified_at === null && (
                            <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
                                <p className="text-sm text-red-600">
                                    Ihre E-Mail-Adresse ist nicht verifiziert.{' '}
                                    <Link
                                        href={route('verification.email.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Klicken Sie hier, um die Bestätigungsmail erneut zu senden.
                                    </Link>
                                </p>

                                {status === 'verification-email-sent' && (
                                    <div className="mt-4 space-y-3">
                                        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-600">
                                            Eine neue Bestätigungsmail wurde an Ihre E-Mail-Adresse gesendet.
                                        </div>
                                        <Label htmlFor="email-otp" className="font-medium">
                                            Bestätigungscode eingeben (8 Ziffern)
                                        </Label>
                                        <InputOTP
                                            id="email-otp"
                                            maxLength={8}
                                            value={tokenData.token}
                                            onChange={(e) => setTokenData('token', e)}
                                            className="mb-2 justify-center"
                                            pattern="[0-9]*"
                                            inputMode="numeric"
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                                <InputOTPSlot index={6} />
                                                <InputOTPSlot index={7} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                        <Button onClick={submitEmailOtp} disabled={tokenData.token.length < 8} className="w-full sm:w-auto">
                                            E-Mail-Adresse verifizieren
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Telefonnummer</Label>

                            <Input
                                id="phone"
                                type="tel"
                                className="mt-1 block w-full"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                required
                                autoComplete="tel"
                                placeholder="+49 151 12345678"
                            />
                        </div>

                        {auth.user.phone_verified_at === null && (
                            <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
                                <p className="text-sm text-red-600">
                                    Ihre Telefonnummer ist nicht verifiziert.{' '}
                                    <Link
                                        href={route('verification.phone.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Klicken Sie hier, um die Bestätigungs-SMS erneut zu senden.
                                    </Link>
                                </p>

                                {status === 'verification-sms-sent' && (
                                    <div className="mt-4 space-y-3">
                                        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-600">
                                            Eine neue Bestätigungs-SMS wurde an Ihre Telefonnummer gesendet.
                                        </div>
                                        <form onSubmit={submitPhoneOtp} className="mt-2 space-y-3">
                                            <Label htmlFor="phone-otp" className="font-medium">
                                                Bestätigungscode eingeben (8 Ziffern)
                                            </Label>
                                            <InputOTP
                                                id="phone-otp"
                                                maxLength={8}
                                                value={phoneOtp}
                                                onChange={setPhoneOtp}
                                                className="mb-2 justify-center"
                                                pattern="[0-9]*"
                                                inputMode="numeric"
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                    <InputOTPSlot index={6} />
                                                    <InputOTPSlot index={7} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                            <Button type="submit" disabled={phoneOtp.length < 8} className="w-full sm:w-auto">
                                                Telefonnummer verifizieren
                                            </Button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Speichern</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Gespeichert</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
