import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Eye, FileText, GitFork, Info, LoaderCircle, Lock, ShieldCheck } from 'lucide-react';
import { FormEventHandler, ReactNode, useState } from 'react';

import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDemographicFields, DemographicData, emptyDemographicData, saveDemographicData, updateDemographicField } from '@/lib/demographics';
import { type SharedData } from '@/types';

// Info Accordion Component
type InfoAccordionProps = {
    title: string;
    children: ReactNode;
    icon?: ReactNode;
};

const InfoAccordion = ({ title, children, icon = <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" /> }: InfoAccordionProps) => {
    return (
        <details className="group mb-2 rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <summary className="flex cursor-pointer items-center justify-between p-3">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    {icon}
                    <span>{title}</span>
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                    <svg
                        className="h-4 w-4 rotate-0 transform transition-transform duration-200 group-open:rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </summary>
            <div className="border-t border-gray-100 px-3 py-3 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">{children}</div>
        </details>
    );
};

// Info Card Component
type InfoCardProps = {
    title: string;
    children: ReactNode;
    icon?: ReactNode;
    className?: string;
};

const InfoCard = ({ title, children, icon = <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />, className }: InfoCardProps) => {
    return (
        <Card className={`border-gray-200 bg-white py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${className || ''}`}>
            <div className="space-y-5 px-6 py-4">
                <div className="flex items-center gap-3">
                    {icon}
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
                </div>
                {children}
            </div>
        </Card>
    );
};

type RegisterForm = {
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    // Add state to track form step
    const [formStep, setFormStep] = useState(1);

    // Modified form data to exclude demographic fields
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    // Separate state for demographic data
    const [demographicData, setDemographicData] = useState<DemographicData>(emptyDemographicData);

    const { name } = usePage<SharedData>().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setFormStep(1);
        saveDemographicData(demographicData);
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Update demographic data handler
    const updateDemographicData = (field: keyof DemographicData, value: string) => {
        updateDemographicField(field, value);
        setDemographicData((prev) => ({ ...prev, [field]: value }));
    };

    // Handler for the Weiter button
    const handleContinue = () => {
        setFormStep(2);
    };

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-[40%_60%] lg:px-0">
            <Head title="Registrieren" />

            {/* Left Column - Privacy Information */}
            <div className="relative hidden h-full flex-col overflow-y-auto bg-gray-50 p-10 text-gray-800 lg:flex dark:bg-gray-900 dark:text-gray-200">
                <div className="absolute inset-0" />

                <div className="relative z-20 flex flex-col gap-6">
                    <Link href={route('index')} className="relative z-20 mb-6 flex items-center text-lg font-medium">
                        <AppLogoIcon className="mr-2 size-8" />
                        {name}
                    </Link>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Transparenz & Datenschutz</h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            Wir legen Wert auf Ihre Privatsphäre und möchten Ihnen erklären, wie wir mit Ihren Daten umgehen und warum wir bestimmte
                            Informationen abfragen.
                        </p>
                    </div>

                    <InfoCard title="Warum wir fragen" icon={<Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />}>
                        <ol className="ml-6 list-decimal space-y-3 text-gray-700 dark:text-gray-300">
                            <li>Um die demografische Verteilung der Bürgermeinungen zu verstehen</li>
                            <li>Um doppelte Abstimmungen zu verhindern und gleichzeitig Anonymität zu gewährleisten</li>
                            <li>Um aggregierte Statistiken über die öffentliche Meinung zu erstellen</li>
                        </ol>
                    </InfoCard>

                    <InfoCard title="Wie wir Ihre Privatsphäre schützen" icon={<Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />}>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <p>Der EU-Parlament-Abstimmungstracker speichert Ihre Daten mit strikter Trennung, um Ihre Privatsphäre zu schützen:</p>

                            <div className="border-l-2 border-gray-200 pl-4 dark:border-gray-700">
                                <div className="mb-1 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Benutzerdaten</h4>
                                </div>
                                <p>
                                    Ihre persönlichen Informationen werden getrennt von Ihren Abstimmungsaktivitäten gespeichert und nur für
                                    Authentifizierung und demografische Statistiken verwendet.
                                </p>
                            </div>

                            <div className="border-l-2 border-gray-200 pl-4 dark:border-gray-700">
                                <div className="mb-1 flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Anonyme Abstimmungen</h4>
                                </div>
                                <p>
                                    Ihre Stimmen werden anonym erfasst, ohne Verbindung zu Ihren persönlichen Daten. Selbst unsere Administratoren
                                    können nicht nachverfolgen, wie Sie abgestimmt haben.
                                </p>
                            </div>
                        </div>
                    </InfoCard>

                    <InfoCard
                        title="DSGVO-Konformität"
                        icon={<FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                        className="bg-background"
                    >
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <p>Gemäß der Datenschutz-Grundverordnung (DSGVO) haben Sie folgende Rechte in Bezug auf Ihre Daten:</p>

                            <div className="grid gap-3">
                                <div className="border-l-2 border-gray-200 pl-4 dark:border-gray-700">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">Recht auf Auskunft</p>
                                    <p className="text-sm">Sie können jederzeit Auskunft über die von uns gespeicherten Daten anfordern.</p>
                                </div>

                                <div className="border-l-2 border-gray-200 pl-4 dark:border-gray-700">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">Recht auf Löschung</p>
                                    <p className="text-sm">
                                        Sie können die Löschung Ihres Kontos und aller damit verbundenen persönlichen Daten verlangen.
                                    </p>
                                </div>

                                <div className="border-l-2 border-gray-200 pl-4 dark:border-gray-700">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">Recht auf Datenübertragbarkeit</p>
                                    <p className="text-sm">Sie können Ihre Daten in einem strukturierten, gängigen Format erhalten.</p>
                                </div>
                            </div>

                            <p className="text-sm italic">
                                Um eines dieser Rechte auszuüben, kontaktieren Sie uns bitte über die Einstellungen in Ihrem Konto oder direkt per
                                E-Mail an datenschutz@abstimmung.eu.
                            </p>
                        </div>
                    </InfoCard>

                    <InfoCard
                        title="Open Source"
                        icon={<GitFork className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                        className="bg-background mt-auto"
                    >
                        <div className="text-gray-700 dark:text-gray-300">
                            <p className="mb-3">
                                Der gesamte Quellcode dieser Plattform ist öffentlich verfügbar und kann auf GitHub eingesehen werden.
                            </p>
                            <a
                                href="https://github.com/abstimmung-eu/abstimmung.eu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                <span>Zum Repository</span>
                                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        </div>
                    </InfoCard>
                </div>
            </div>

            {/* Right Column - Registration Form */}
            <div className="flex h-full w-full flex-col justify-center bg-white p-6 lg:p-12 dark:bg-gray-900">
                <div className="mx-auto flex w-full flex-col justify-center space-y-5 sm:w-[400px]">
                    <Link href={route('index')} className="relative z-20 mb-3 flex items-center justify-center lg:hidden">
                        <AppLogoIcon className="h-8 w-8 fill-current text-blue-600 dark:text-blue-400" />
                    </Link>

                    <div className="flex flex-col items-center justify-center gap-2 text-center md:items-start md:text-left">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Account erstellen</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formStep === 1
                                ? 'Geben Sie Ihre Details unten ein, um Ihr Konto zu erstellen'
                                : 'Bitte füllen Sie Ihre demografischen Daten aus'}
                        </p>
                    </div>

                    {/* Mobile Privacy Information Card - More Compact */}
                    <Card className="border border-gray-200 bg-gray-50 p-2 shadow-sm lg:hidden dark:border-gray-700 dark:bg-gray-800">
                        <div className="p-3">
                            <div className="mb-2 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <h3 className="text-sm font-medium dark:text-gray-100">Datenschutz-Hinweis</h3>
                            </div>
                            <p className="mb-2 text-xs text-gray-600 dark:text-gray-300">
                                Ihre persönlichen Daten werden ausschließlich für statistische Zwecke verwendet und nicht mit Ihren Abstimmungen
                                verknüpft. Alle Stimmen sind vollständig anonym.
                            </p>
                            <details className="text-xs">
                                <summary className="inline-flex cursor-pointer items-center p-0.5 font-medium text-blue-600 hover:underline dark:text-blue-400">
                                    Mehr erfahren
                                </summary>
                                <div className="mt-2 space-y-2 text-gray-600 dark:text-gray-300">
                                    <div>
                                        <h4 className="mb-0.5 flex items-center gap-1 font-medium">
                                            <Info className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                            Warum wir fragen
                                        </h4>
                                        <ul className="ml-4 list-disc space-y-0.5">
                                            <li>Demografische Verteilungen zu verstehen</li>
                                            <li>Doppelte Abstimmungen zu verhindern</li>
                                            <li>Anonyme Statistiken zu erstellen</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="mb-0.5 flex items-center gap-1 font-medium">
                                            <FileText className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                            DSGVO-Rechte
                                        </h4>
                                        <p className="mb-0.5">Sie haben das Recht auf:</p>
                                        <ul className="ml-4 list-disc space-y-0.5 text-xs">
                                            <li>Auskunft über Ihre gespeicherten Daten</li>
                                            <li>Löschung Ihrer Daten</li>
                                            <li>Übertragbarkeit Ihrer Daten</li>
                                        </ul>
                                    </div>
                                </div>
                            </details>
                        </div>
                    </Card>

                    <form className="flex flex-col gap-4" onSubmit={submit}>
                        <div className="grid gap-4">
                            {formStep === 1 ? (
                                <>
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
                                            disabled={processing}
                                            placeholder="email@example.com"
                                        />
                                        <InputError message={errors.email} className="mt-1" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Telefonnummer (Deutschland)</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            required
                                            pattern="^(\+49|0)[1][5-7][0-9]\s?[0-9\s]{7,10}$"
                                            title="Bitte geben Sie eine gültige deutsche Mobilnummer ein (z.B. +49 151 12345678)"
                                            tabIndex={2}
                                            autoComplete="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            disabled={processing}
                                            placeholder="+49 151 12345678"
                                        />
                                        <InputError message={errors.phone} className="mt-1" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Passwort</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            minLength={8}
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            disabled={processing}
                                            placeholder="Passwort (mind. 8 Zeichen)"
                                        />
                                        <InputError message={errors.password} className="mt-1" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">Passwort bestätigen</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            disabled={processing}
                                            placeholder="Passwort bestätigen"
                                        />
                                        <InputError message={errors.password_confirmation} className="mt-1" />
                                    </div>

                                    <InfoAccordion title="Warum wir nach E-Mail und Telefonnummer fragen">
                                        <p>
                                            Diese Informationen helfen uns, Spam zu verhindern und bieten eine grundlegende Verifizierung Ihrer
                                            Identität. Wir sind uns bewusst, dass dies kein perfekter Schutz ist, aber es erhöht die Qualität der
                                            Teilnahme deutlich.
                                        </p>
                                    </InfoAccordion>

                                    <Button
                                        type="button"
                                        className="mt-2 w-full"
                                        tabIndex={5}
                                        onClick={(e) => {
                                            // Check form validity before proceeding
                                            const form = e.currentTarget.closest('form');
                                            if (form && form.checkValidity() && data.password === data.password_confirmation) {
                                                handleContinue();
                                            } else {
                                                // Trigger HTML5 validation
                                                form?.reportValidity();

                                                // Custom check for password match
                                                if (data.password !== data.password_confirmation && data.password_confirmation !== '') {
                                                    alert('Passwörter stimmen nicht überein');
                                                }
                                            }
                                        }}
                                    >
                                        Weiter
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <InfoAccordion title="Warum wir Ihre Demographischen Daten erheben">
                                        <p>
                                            Ihre demografischen Daten werden ausschließlich lokal auf Ihrem Gerät gespeichert und nicht an unseren
                                            Server übermittelt. Sie sind nicht mit Ihrem Account verknüpft und werden nur anonym bei Ihrer Teilnahme
                                            an Abstimmungen für statistische Auswertungen verwendet.
                                        </p>
                                    </InfoAccordion>

                                    {getDemographicFields().map((field) => (
                                        <div key={field.key} className="grid gap-2">
                                            <Label htmlFor={field.key}>{field.label}</Label>
                                            <Select
                                                value={demographicData[field.key as keyof DemographicData]}
                                                onValueChange={(value) => updateDemographicData(field.key as keyof DemographicData, value)}
                                                disabled={processing}
                                            >
                                                <SelectTrigger id={field.key} className="w-full">
                                                    <SelectValue placeholder={`${field.label} auswählen`} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {field.options.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}

                                    <div className="mt-2 flex gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            tabIndex={8}
                                            disabled={processing}
                                            onClick={() => setFormStep(1)}
                                        >
                                            Zurück
                                        </Button>

                                        <Button type="submit" className="flex-1" tabIndex={9} disabled={processing}>
                                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                            Account erstellen
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="mt-2 text-center text-sm text-gray-500">
                            Sie haben bereits ein Konto?{' '}
                            <TextLink href={route('login')} tabIndex={formStep === 1 ? 6 : 10}>
                                Anmelden
                            </TextLink>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
