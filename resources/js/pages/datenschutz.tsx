import { PageHeader } from '@/components/page-header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Datenschutz',
        href: '/datenschutz',
    },
];

export default function Datenschutz() {
    // Get app name from shared props
    const { props } = usePage<SharedData>();
    const { name } = props;

    // Datenschutz FAQ items
    const datenschutzItems = [
        {
            question: 'Welche personenbezogenen Daten werden erhoben?',
            answer: 'Bei der Registrierung erheben wir Ihre E-Mail-Adresse und Telefonnummer zur Verifizierung Ihres Kontos. Optional können Sie demografische Daten wie Alter, Geschlecht oder Bundesland angeben, die jedoch nur anonym gespeichert werden. Beim Besuch unserer Website werden zudem automatisch technische Informationen wie IP-Adresse, Browsertyp und Zugriffszeit erfasst, die für den Betrieb der Website notwendig sind.'
        },
        {
            question: 'Wie werden meine Abstimmungsdaten behandelt?',
            answer: 'Ihre Abstimmungen werden vollständig anonym gespeichert. Es besteht keine technische Möglichkeit, abgegebene Stimmen mit Ihrem Benutzerkonto zu verknüpfen. Die demografischen Daten werden nur in aggregierter Form für statistische Auswertungen verwendet, ohne dass Rückschlüsse auf einzelne Personen möglich sind.'
        },
        {
            question: 'Wie werden meine persönlichen Daten geschützt?',
            answer: 'Wir setzen modernste Sicherheitsmaßnahmen ein, um Ihre Daten zu schützen. Dazu gehören Verschlüsselung bei der Datenübertragung (SSL/TLS), regelmäßige Sicherheitsupdates und strikte Zugriffskontrollen für unsere Systeme. Persönliche Daten und Abstimmungsdaten werden zudem getrennt voneinander gespeichert.'
        },
        {
            question: 'Werden meine Daten an Dritte weitergegeben?',
            answer: 'Wir geben Ihre personenbezogenen Daten grundsätzlich nicht an Dritte weiter. Ausnahmen bestehen nur, wenn wir gesetzlich dazu verpflichtet sind oder wenn dies zur Erfüllung unserer Dienstleistung notwendig ist (z.B. technische Dienstleister). Mit allen Dienstleistern haben wir Auftragsverarbeitungsverträge abgeschlossen, die den Schutz Ihrer Daten sicherstellen.'
        },
        {
            question: 'Welche Cookies werden verwendet?',
            answer: 'Wir verwenden nur technisch notwendige Cookies, die für den Betrieb der Website erforderlich sind (z.B. Session-Cookies für die Anmeldung). Darüber hinaus setzen wir keine Tracking- oder Analyse-Cookies ein, es sei denn, Sie haben dem ausdrücklich zugestimmt.'
        },
        {
            question: 'Wie lange werden meine Daten gespeichert?',
            answer: 'Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für die Zwecke, für die sie erhoben wurden, erforderlich ist. Kontodaten werden so lange gespeichert, wie Ihr Benutzerkonto besteht. Nach Löschung Ihres Kontos werden alle personenbezogenen Daten innerhalb von 30 Tagen gelöscht. Anonymisierte Abstimmungsdaten können aus technischen Gründen nicht gelöscht werden.'
        },
        {
            question: 'Welche Rechte habe ich bezüglich meiner Daten?',
            answer: 'Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten. Zudem können Sie Ihre Einwilligung jederzeit widerrufen und haben ein Recht auf Datenübertragbarkeit. Bei Fragen zu Ihren Rechten können Sie sich jederzeit an uns wenden.'
        },
        {
            question: 'Wie kann ich mein Konto und meine Daten löschen?',
            answer: 'Sie können Ihr Konto jederzeit in den Kontoeinstellungen löschen. Mit der Löschung werden alle Ihre personenbezogenen Daten unwiderruflich entfernt. Bereits abgegebene Abstimmungen bleiben aufgrund ihrer Anonymität bestehen, können aber nicht mit Ihnen in Verbindung gebracht werden.'
        },
        {
            question: 'Findet Profiling oder automatisierte Entscheidungsfindung statt?',
            answer: 'Nein, wir führen kein Profiling und keine automatisierte Entscheidungsfindung durch. Die Auswertung von Abstimmungsdaten erfolgt nur in anonymisierter und aggregierter Form zu statistischen Zwecken.'
        },
        {
            question: 'An wen kann ich mich bei Datenschutzfragen wenden?',
            answer: `Bei Fragen zum Datenschutz, zur Ausübung Ihrer Rechte oder bei Beschwerden können Sie uns über das Kontaktformular oder direkt per E-Mail an datenschutz@${name} erreichen. Wir bemühen uns, Ihnen schnellstmöglich zu antworten und Ihre Anliegen zu bearbeiten.`
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Datenschutz" />

            <div className="container mx-auto max-w-4xl px-4 py-8">
                <PageHeader title="Datenschutzerklärung" />

                <div className="mb-10">
                    <div className="mt-8 mb-12">
                        <h2 className="mb-4 text-2xl font-bold tracking-tighter">Einleitung</h2>
                        <p className="mb-6 text-lg">
                            Der Schutz Ihrer Privatsphäre und der verantwortungsvolle Umgang mit Ihren persönlichen Daten haben für uns höchste Priorität. 
                            Diese Datenschutzerklärung informiert Sie transparent darüber, wie wir Ihre personenbezogenen Daten erheben, verarbeiten und schützen.
                        </p>

                        <h2 className="mb-4 text-2xl font-bold tracking-tighter">Verantwortliche Stelle</h2>
                        <p className="mb-6 text-lg">
                            Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist der Betreiber 
                            von {name}. Die Kontaktdaten finden Sie in unserem Impressum.
                        </p>

                        <h2 className="mb-4 text-2xl font-bold tracking-tighter">Grundsatz der anonymen Nutzung</h2>
                        <p className="mb-6 text-lg">
                            Unser zentrales Anliegen ist es, Ihre Abstimmungen vollständig anonym zu verarbeiten. Dies bedeutet, dass wir technisch 
                            sicherstellen, dass keine Verbindung zwischen Ihren persönlichen Daten und Ihrem Abstimmungsverhalten hergestellt werden kann – 
                            weder durch uns noch durch Dritte. Wir erheben nur die Daten, die für den Betrieb der Plattform unbedingt notwendig sind, 
                            und verarbeiten diese nach den strengen Vorgaben der DSGVO.
                        </p>

                        <h2 className="mb-4 text-2xl font-bold tracking-tighter">Datensparsamkeit und Anonymität</h2>
                        <p className="mb-6 text-lg">
                            Wir folgen konsequent dem Prinzip der Datensparsamkeit und erheben nur die Daten, die für den Betrieb der Plattform und 
                            die Verhinderung von Missbrauch notwendig sind. Demografische Daten werden nur in anonymisierter Form gespeichert und 
                            können nicht mit Ihrem Benutzerkonto in Verbindung gebracht werden. Sämtliche Abstimmungsdaten werden vollständig anonymisiert 
                            gespeichert und können nicht mehr einzelnen Nutzern zugeordnet werden.
                        </p>

                        <h2 className="mb-4 text-2xl font-bold tracking-tighter">Zweck der Datenverarbeitung</h2>
                        <p className="mb-6 text-lg">
                            Die Verarbeitung Ihrer personenbezogenen Daten erfolgt ausschließlich zu folgenden Zwecken:
                        </p>
                        <ul className="mb-6 list-disc pl-8 text-lg">
                            <li>Bereitstellung und Verbesserung unserer Plattform</li>
                            <li>Ermöglichung der Kontoerstellung und -verwaltung</li>
                            <li>Verhinderung von Mehrfachabstimmungen und Missbrauch</li>
                            <li>Anonymisierte statistische Auswertung von Abstimmungsergebnissen</li>
                            <li>Erfüllung gesetzlicher Verpflichtungen</li>
                        </ul>

                        <h2 className="mb-4 text-2xl font-bold tracking-tighter">Transparenz und Kontrolle</h2>
                        <p className="mb-6 text-lg">
                            Wir legen großen Wert auf Transparenz in der Datenverarbeitung und geben Ihnen weitreichende Kontrolle über Ihre Daten. 
                            Sie können jederzeit Auskunft über Ihre gespeicherten Daten erhalten, diese korrigieren oder löschen lassen. Die Details dazu 
                            finden Sie im Abschnitt zu Ihren Rechten und in unseren häufig gestellten Fragen.
                        </p>
                    </div>

                    <h2 className="mb-6 text-3xl font-bold tracking-tighter">Häufig gestellte Fragen zum Datenschutz</h2>

                    <Accordion type="single" collapsible className="mb-12">
                        {datenschutzItems.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left text-lg font-bold">{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="py-2 text-base">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="mt-8 border-t pt-8">
                        <p className="mb-4 italic text-gray-600">
                            Diese Datenschutzerklärung wurde zuletzt am 17.03.2025 aktualisiert. 
                            Wir behalten uns vor, diese Datenschutzerklärung jederzeit unter Beachtung der geltenden Datenschutzvorschriften zu ändern.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
