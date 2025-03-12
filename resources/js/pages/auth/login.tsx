import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Link } from '@inertiajs/react';

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
        <div className="relative grid h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-[40%_60%] lg:px-0">
            <Head title="Anmelden" />

            {/* Left Column - Colored Background */}
            <div className="relative hidden h-full flex-col overflow-auto bg-blue-600 p-10 text-white lg:flex">
                <div className="absolute inset-0" />

                <div className="relative z-20 flex h-full flex-col items-center justify-center gap-6">
                    <AppLogoIcon className="h-12 w-12 fill-current text-white" />
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-white">Willkommen zurück</h2>
                        <p className="mt-2 text-blue-100">
                            Melden Sie sich an, um Ihre Abstimmungen und Aktivitäten zu verfolgen.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="w-full bg-white p-6 lg:p-12">
                <div className="mx-auto flex w-full flex-col justify-center space-y-5 sm:w-[400px]">
                    <Link href={route('index')} className="relative z-20 mb-3 flex items-center justify-center lg:hidden">
                        <AppLogoIcon className="h-8 w-8 fill-current text-blue-600" />
                    </Link>

                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Mit Ihrem Account anmelden</h1>
                        <p className="text-sm text-gray-500">Geben Sie Ihre E-Mail-Adresse und ihr Passwort unten ein, um sich anzumelden</p>
                    </div>

                    {status && <div className="text-center text-sm font-medium text-green-600">{status}</div>}

                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">E-Mail-Adresse</Label>
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
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Passwort</Label>
                                    {canResetPassword && (
                                        <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                            Passwort vergessen?
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
                                    placeholder="Passwort"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" name="remember" checked={data.remember} onClick={() => setData('remember', !data.remember)} tabIndex={3} />
                                <Label htmlFor="remember">Angemeldet bleiben</Label>
                            </div>

                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Anmelden
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm">
                            Noch kein Konto?{' '}
                            <TextLink href={route('register')} tabIndex={5}>
                                Registrieren
                            </TextLink>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
