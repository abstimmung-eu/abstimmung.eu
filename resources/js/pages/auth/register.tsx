import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Eye, FileText, GitFork, Info, LoaderCircle, Lock, ShieldCheck, XCircle } from 'lucide-react';
import { FormEventHandler, ReactNode, useEffect, useState } from 'react';

import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type SharedData } from '@/types';
import { 
    DemographicData, 
    emptyDemographicData, 
    saveDemographicData, 
    loadDemographicData,
    updateDemographicField,
    generateYearOptions 
} from '@/lib/demographics';

// Info Accordion Component
type InfoAccordionProps = {
    title: string;
    children: ReactNode;
    icon?: ReactNode;
};

const InfoAccordion = ({ title, children, icon = <Info className="h-4 w-4 text-blue-600" /> }: InfoAccordionProps) => {
    return (
        <details className="group mb-2 rounded-md border border-gray-200 bg-white">
            <summary className="flex cursor-pointer items-center justify-between p-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    {icon}
                    <span>{title}</span>
                </div>
                <div className="text-gray-500">
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
            <div className="border-t border-gray-100 px-3 py-3 text-sm text-gray-700">{children}</div>
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

const InfoCard = ({ title, children, icon = <Info className="h-5 w-5 text-blue-600" />, className }: InfoCardProps) => {
    return (
        <Card className={`border-gray-200 bg-white py-2 shadow-sm ${className || ''}`}>
            <div className="space-y-5 px-6 py-4">
                <div className="flex items-center gap-3">
                    {icon}
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
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
    
    // Add validation states
    const [isPhoneValid, setIsPhoneValid] = useState<boolean | null>(null);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
    const [phoneTouched, setPhoneTouched] = useState(false);
    
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

    // Generate year options for birthyear select
    const yearOptions = generateYearOptions();

    // Add state to track password match status
    const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
    // Add state to track if password confirmation field has been blurred
    const [confirmationTouched, setConfirmationTouched] = useState(false);

    // Check password match whenever either password field changes
    useEffect(() => {
        if (data.password_confirmation === '') {
            setPasswordsMatch(null);
        } else if (data.password === '') {
            setPasswordsMatch(false);
        } else {
            setPasswordsMatch(data.password === data.password_confirmation);
        }
    }, [data.password, data.password_confirmation]);

    // Validate German phone number
    useEffect(() => {
        if (data.phone === '') {
            setIsPhoneValid(null);
            return;
        }
        
        // German mobile number validation regex
        // Accepts formats like: +49151xxxxxxx, +49 151 xxxx xxxx, 0151xxxxxxx, etc.
        const germanMobileRegex = /^(\+49|0)[1][5-7][0-9]\s?[0-9\s]{7,10}$/;
        setIsPhoneValid(germanMobileRegex.test(data.phone));
    }, [data.phone]);

    // Validate password length
    useEffect(() => {
        if (data.password === '') {
            setIsPasswordValid(null);
            return;
        }
        
        setIsPasswordValid(data.password.length >= 8);
    }, [data.password]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setFormStep(1)
        saveDemographicData(demographicData);
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Update demographic data handler
    const updateDemographicData = (field: keyof DemographicData, value: string) => {
        setDemographicData((prev) => updateDemographicField(prev, field, value));
    };

    // Handler for the Weiter button
    const handleContinue = () => {
        setFormStep(2);
    };

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-[40%_60%] lg:px-0">
            <Head title="Registrieren" />

            {/* Left Column - Privacy Information */}
            <div className="relative hidden h-full flex-col overflow-y-auto bg-gray-50 p-10 text-gray-800 lg:flex">
                <div className="absolute inset-0" />

                <div className="relative z-20 flex flex-col gap-6">
                    <Link href={route('index')} className="relative z-20 mb-6 flex items-center text-lg font-medium">
                        <AppLogoIcon className="mr-2 size-8" />
                        {name}
                    </Link>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-gray-900">Transparenz & Datenschutz</h2>
                        <p className="text-gray-700">
                            Wir legen Wert auf Ihre Privatsphäre und möchten Ihnen erklären, wie wir mit Ihren Daten umgehen und warum wir bestimmte
                            Informationen abfragen.
                        </p>
                    </div>

                    <InfoCard title="Warum wir fragen" icon={<Info className="h-5 w-5 text-blue-600" />}>
                        <ol className="ml-6 list-decimal space-y-3 text-gray-700">
                            <li>Um die demografische Verteilung der Bürgermeinungen zu verstehen</li>
                            <li>Um doppelte Abstimmungen zu verhindern und gleichzeitig Anonymität zu gewährleisten</li>
                            <li>Um aggregierte Statistiken über die öffentliche Meinung zu erstellen</li>
                        </ol>
                    </InfoCard>

                    <InfoCard title="Wie wir Ihre Privatsphäre schützen" icon={<Lock className="h-5 w-5 text-blue-600" />}>
                        <div className="space-y-4 text-gray-700">
                            <p>Der EU-Parlament-Abstimmungstracker speichert Ihre Daten mit strikter Trennung, um Ihre Privatsphäre zu schützen:</p>

                            <div className="border-l-2 border-gray-200 pl-4">
                                <div className="mb-1 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                                    <h4 className="font-medium text-gray-900">Benutzerdaten</h4>
                                </div>
                                <p>
                                    Ihre persönlichen Informationen werden getrennt von Ihren Abstimmungsaktivitäten gespeichert und nur für
                                    Authentifizierung und demografische Statistiken verwendet.
                                </p>
                            </div>

                            <div className="border-l-2 border-gray-200 pl-4">
                                <div className="mb-1 flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-blue-600" />
                                    <h4 className="font-medium text-gray-900">Anonyme Abstimmungen</h4>
                                </div>
                                <p>
                                    Ihre Stimmen werden anonym erfasst, ohne Verbindung zu Ihren persönlichen Daten. Selbst unsere Administratoren
                                    können nicht nachverfolgen, wie Sie abgestimmt haben.
                                </p>
                            </div>
                        </div>
                    </InfoCard>

                    <InfoCard title="DSGVO-Konformität" icon={<FileText className="h-5 w-5 text-blue-600" />} className="bg-background">
                        <div className="space-y-4 text-gray-700">
                            <p>Gemäß der Datenschutz-Grundverordnung (DSGVO) haben Sie folgende Rechte in Bezug auf Ihre Daten:</p>

                            <div className="grid gap-3">
                                <div className="border-l-2 border-gray-200 pl-4">
                                    <p className="font-medium text-gray-900">Recht auf Auskunft</p>
                                    <p className="text-sm">Sie können jederzeit Auskunft über die von uns gespeicherten Daten anfordern.</p>
                                </div>

                                <div className="border-l-2 border-gray-200 pl-4">
                                    <p className="font-medium text-gray-900">Recht auf Löschung</p>
                                    <p className="text-sm">
                                        Sie können die Löschung Ihres Kontos und aller damit verbundenen persönlichen Daten verlangen.
                                    </p>
                                </div>

                                <div className="border-l-2 border-gray-200 pl-4">
                                    <p className="font-medium text-gray-900">Recht auf Datenübertragbarkeit</p>
                                    <p className="text-sm">Sie können Ihre Daten in einem strukturierten, gängigen Format erhalten.</p>
                                </div>
                            </div>

                            <p className="text-sm italic">
                                Um eines dieser Rechte auszuüben, kontaktieren Sie uns bitte über die Einstellungen in Ihrem Konto oder direkt per
                                E-Mail an datenschutz@abstimmung.eu.
                            </p>
                        </div>
                    </InfoCard>

                    <InfoCard title="Open Source" icon={<GitFork className="h-5 w-5 text-blue-600" />} className="bg-background mt-auto">
                        <div className="text-gray-700">
                            <p className="mb-3">
                                Der gesamte Quellcode dieser Plattform ist öffentlich verfügbar und kann auf GitHub eingesehen werden.
                            </p>
                            <a
                                href="https://github.com/abstimmung-eu/abstimmung.eu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700"
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
            <div className="w-full bg-white p-6 lg:p-12">
                <div className="mx-auto flex w-full flex-col justify-center space-y-5 sm:w-[400px]">
                    <Link href={route('index')} className="relative z-20 mb-3 flex items-center justify-center lg:hidden">
                        <AppLogoIcon className="h-8 w-8 fill-current text-blue-600" />
                    </Link>

                    <div className="flex flex-col items-center justify-center gap-2 text-center md:items-start md:text-left">
                        <h1 className="text-2xl font-semibold text-gray-900">Account erstellen</h1>
                        <p className="text-sm text-gray-500">
                            {formStep === 1
                                ? 'Geben Sie Ihre Details unten ein, um Ihr Konto zu erstellen'
                                : 'Bitte füllen Sie Ihre demografischen Daten aus'}
                        </p>
                    </div>

                    {/* Mobile Privacy Information Card - More Compact */}
                    <Card className="border border-gray-200 bg-gray-50 p-2 shadow-sm lg:hidden">
                        <div className="p-3">
                            <div className="mb-2 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-green-600" />
                                <h3 className="text-sm font-medium">Datenschutz-Hinweis</h3>
                            </div>
                            <p className="mb-2 text-xs text-gray-600">
                                Ihre persönlichen Daten werden ausschließlich für statistische Zwecke verwendet und nicht mit Ihren Abstimmungen
                                verknüpft. Alle Stimmen sind vollständig anonym.
                            </p>
                            <details className="text-xs">
                                <summary className="inline-flex cursor-pointer items-center p-0.5 font-medium text-blue-600 hover:underline">
                                    Mehr erfahren
                                </summary>
                                <div className="mt-2 space-y-2 text-gray-600">
                                    <div>
                                        <h4 className="mb-0.5 flex items-center gap-1 font-medium">
                                            <Info className="h-3 w-3 text-blue-600" />
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
                                            <FileText className="h-3 w-3 text-blue-600" />
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
                                                if (data.password !== data.password_confirmation && 
                                                    data.password_confirmation !== '') {
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

                                    <div className="grid gap-2">
                                        <Label htmlFor="birthyear">Geburtsjahr</Label>
                                        <Select
                                            value={demographicData.birthyear}
                                            onValueChange={(value) => updateDemographicData('birthyear', value)}
                                            disabled={processing}
                                        >
                                            <SelectTrigger id="birthyear" className="w-full">
                                                <SelectValue placeholder="Geburtsjahr auswählen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {yearOptions.map(({ value, label }) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="gender">Geschlecht</Label>
                                        <Select
                                            value={demographicData.gender}
                                            onValueChange={(value) => updateDemographicData('gender', value)}
                                            disabled={processing}
                                        >
                                            <SelectTrigger id="gender" className="w-full">
                                                <SelectValue placeholder="Geschlecht auswählen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Männlich</SelectItem>
                                                <SelectItem value="female">Weiblich</SelectItem>
                                                <SelectItem value="other">Anderes</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="marital_status">Familienstand</Label>
                                        <Select
                                            value={demographicData.marital_status}
                                            onValueChange={(value) => updateDemographicData('marital_status', value)}
                                            disabled={processing}
                                        >
                                            <SelectTrigger id="marital_status" className="w-full">
                                                <SelectValue placeholder="Familienstand auswählen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="single">Single</SelectItem>
                                                <SelectItem value="married">Verheiratet</SelectItem>
                                                <SelectItem value="divorced">Geschieden</SelectItem>
                                                <SelectItem value="widowed">Verwitwet</SelectItem>
                                                <SelectItem value="in_partnership">In einer Partnerschaft lebend</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="education">Bildungsniveau</Label>
                                        <Select
                                            value={demographicData.education}
                                            onValueChange={(value) => updateDemographicData('education', value)}
                                            disabled={processing}
                                        >
                                            <SelectTrigger id="education" className="w-full">
                                                <SelectValue placeholder="Bildungsniveau auswählen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Kein Schulabschluss</SelectItem>
                                                <SelectItem value="primary">Hauptschulabschluss</SelectItem>
                                                <SelectItem value="secondary">Realschulabschluss (Mittlere Reife)</SelectItem>
                                                <SelectItem value="bachelor">Abitur (Allgemeine Hochschulreife)</SelectItem>
                                                <SelectItem value="master">Hochschulabschluss (z. B. Bachelor, Master, Diplom)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="profession">Berufliche Situation</Label>
                                        <Select
                                            value={demographicData.profession}
                                            onValueChange={(value) => updateDemographicData('profession', value)}
                                            disabled={processing}
                                        >
                                            <SelectTrigger id="profession" className="w-full">
                                                <SelectValue placeholder="Berufliche Situation auswählen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="full-time">Vollzeitbeschäftigt</SelectItem>
                                                <SelectItem value="part-time">Teilzeitbeschäftigt</SelectItem>
                                                <SelectItem value="self-employed">Selbständig</SelectItem>
                                                <SelectItem value="unemployed">Arbeitslos</SelectItem>
                                                <SelectItem value="retired">Rentner:in</SelectItem>
                                                <SelectItem value="student">Schüler:in, Student:in</SelectItem>
                                                <SelectItem value="housewife">Hausfrau, Hausmann</SelectItem>
                                                <SelectItem value="other">Andere (z.B. in Ausbildung)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="household_size">Anzahl der Personen im Haushalt</Label>
                                        <Select
                                            value={demographicData.household_size}
                                            onValueChange={(value) => updateDemographicData('household_size', value)}
                                            disabled={processing}
                                        >
                                            <SelectTrigger id="household_size" className="w-full">
                                                <SelectValue placeholder="Anzahl der Personen im Haushalt auswählen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 Person</SelectItem>
                                                <SelectItem value="2">2 Personen</SelectItem>
                                                <SelectItem value="3">3 Personen</SelectItem>
                                                <SelectItem value="4">4 Personen</SelectItem>
                                                <SelectItem value="5">5 oder mehr Personen</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="income">Haushaltsnettoeinkommen</Label>
                                        <Select
                                            value={demographicData.income}
                                            onValueChange={(value) => updateDemographicData('income', value)}
                                            disabled={processing}
                                        >
                                            <SelectTrigger id="income" className="w-full">
                                                <SelectValue placeholder="Haushaltsnettoeinkommen auswählen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Unter 1000 €</SelectItem>
                                                <SelectItem value="2">1000 - 1999 €</SelectItem>
                                                <SelectItem value="3">2000 - 2999 €</SelectItem>
                                                <SelectItem value="4">3000 - 3999 €</SelectItem>
                                                <SelectItem value="5">4000 - 4999 €</SelectItem>
                                                <SelectItem value="6">5000 - 5999 €</SelectItem>
                                                <SelectItem value="7">6000 - 6999 €</SelectItem>
                                                <SelectItem value="8">7000 - 7999 €</SelectItem>
                                                <SelectItem value="9">8000 - 8999 €</SelectItem>
                                                <SelectItem value="10">9000 - 9999 €</SelectItem>
                                                <SelectItem value="11">Über 10000 €</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

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
