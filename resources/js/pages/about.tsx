import { PageHeader } from '@/components/page-header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Über uns',
        href: '/about',
    },
];

// FAQ items
const faqItems = [
    // Grundlegende Informationen zur Plattform
    {
        question: 'Woher stammen die Daten zu den Bundestagsabstimmungen?',
        answer: 'Unsere Daten basieren auf den offiziellen Protokollen und Dokumentationen des Deutschen Bundestages. Wir stellen sicher, dass Informationen korrekt und vollständig übernommen werden. Sollten dennoch Fehler auftreten, sind wir dankbar für Hinweise und Korrekturen.',
    },
    {
        question: 'Wie oft werden neue Abstimmungen hinzugefügt?',
        answer: 'Neue Abstimmungen werden zeitnah nach jeder namentlichen Abstimmung im Bundestag auf unserer Plattform hinzugefügt, in der Regel innerhalb von 24 Stunden. Wir bemühen uns, die Plattform aktuell und umfassend zu halten.',
    },
    {
        question: 'Ist die Plattform politisch neutral?',
        answer: 'Ja, wir verpflichten uns zu strikter politischer Neutralität. Wir stellen Informationen objektiv dar und geben keine Empfehlungen oder Bewertungen zu politischen Positionen ab. Unser Ziel ist Transparenz, nicht Einflussnahme.',
    },
    {
        question: 'Wie finanziert sich die Plattform?',
        answer: 'Derzeit wird die Plattform privat finanziert und ist ein nicht-kommerzielles Projekt. Die Betriebskosten halten sich momentan in überschaubaren Grenzen. Um unsere Unabhängigkeit zu wahren, nehmen wir bewusst keine Spenden von politischen Parteien oder Interessengruppen an. Für die Zukunft prüfen wir transparente Finanzierungsmodelle, die unsere Neutralität und Integrität garantieren können.',
    },

    // Teilnahme und Anmeldung
    {
        question: 'Wie kann ich an einer Abstimmung teilnehmen?',
        answer: 'Um an einer Abstimmung teilzunehmen, benötigen Sie einen Account auf unserer Plattform. Nach der Anmeldung können Sie Ihre Stimme zu den einzelnen Themen abgeben und an Diskussionen teilnehmen.',
    },
    {
        question: 'Warum muss ich mich anmelden?',
        answer: 'Die Anmeldung dient dazu, eine gute Qualität der Abstimmungen zu gewährleisten und Mehrfachabstimmungen zu verhindern. Durch die Bestätigung Ihrer E-Mail-Adresse und Ihrer Telefon- oder Handynummer stellen wir sicher, dass es sich um einen echten Nutzer handelt. Betrug ist somit zwar nicht komplett ausgeschlossen, aber deutlich erschwert.',
    },
    {
        question: 'Welche Daten werden bei der Anmeldung gesammelt?',
        answer: 'Bei der Anmeldung erfassen wir Ihre E-Mail-Adresse und Handynummer für die Kontoverifikation. Zusätzlich haben Sie die Möglichkeit, demografische Daten (wie Alter, Geschlecht oder Bundesland) lokal auf Ihrem Gerät zu speichern. Diese demographischen Daten werden nur anonym zusammen mit Ihrer Abstimmung übertragen, aber nicht mit Ihrem Konto verknüpft oder dauerhaft auf unseren Servern gespeichert.',
    },

    // Datenschutz und Anonymität
    {
        question: 'Ist die Abstimmung wirklich anonym?',
        answer: 'Ja, die Abstimmung ist vollständig anonym. Abstimmungsergebnisse werden getrennt von persönlichen Daten gespeichert und aggregiert. Niemand – auch nicht unser Team – kann herausfinden, wie Sie bei einzelnen Themen abgestimmt haben.',
    },

    // Nutzerkonto und Einstellungen
    {
        question: 'Kann ich meine Angaben und Einstellungen ändern?',
        answer: 'Ja, Sie können Ihre Daten und Kontoeinstellungen jederzeit in Ihrem Profil bearbeiten und aktualisieren.',
    },
    {
        question: 'Kann ich meine Abstimmung rückgängig machen?',
        answer: 'Nein, abgegebene Stimmen können nicht rückgängig gemacht werden. Dies ist eine Konsequenz unseres anonymen Abstimmungssystems – wir können Ihre Stimme nicht identifizieren, nachdem sie abgegeben wurde.',
    },

    // Kommunikation und Interaktion
    {
        question: 'Kann ich mit anderen Nutzern über die Abstimmungsthemen diskutieren?',
        answer: 'Ja, zu jeder Abstimmung gibt es einen Diskussionsbereich. Wir verstehen diesen als wichtigen Raum für demokratischen Austausch und verschiedene Perspektiven. Wir appellieren an einen respektvollen und sachlichen Umgang miteinander. Konstruktive Kritik und fundierte Argumente bereichern die Diskussion, während persönliche Angriffe und pauschale Verurteilungen dem gemeinsamen Dialog schaden.',
    },
    {
        question: 'Kann ich eigene Abstimmungsthemen vorschlagen?',
        answer: 'Aktuell bilden wir ausschließlich die offiziellen Bundestagsabstimmungen ab. Es gibt jedoch bereits erste Überlegungen, eine Funktion zu implementieren, mit der Nutzer eigene Themen für community-basierte Abstimmungen vorschlagen könnten. Diese würden dann klar von den offiziellen Abstimmungen unterschieden werden. Wir halten Sie über die Entwicklung dieser neuen Funktion auf dem Laufenden.',
    },

    // Zukunftspläne und Mitwirkung
    {
        question: 'Wie kann ich zur Weiterentwicklung der Plattform beitragen?',
        answer: 'Wir freuen uns über Feedback und Verbesserungsvorschläge! Kontaktieren Sie uns dazu direkt per E-Mail oder Social Media. Technisch versierte Nutzer können auch über unsere GitHub-Repository zur Entwicklung beitragen.',
    },
    {
        question: 'Gibt es eine App für Smartphones?',
        answer: 'Aktuell bieten wir eine mobiloptimierte Webseite an. Eine native App für iOS und Android ist in Planung und wird voraussichtlich in den kommenden Wochen verfügbar sein.',
    },
];

export default function About() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Über uns" />

            <div className="container mx-auto max-w-4xl px-4 py-8">
                <PageHeader title="Über uns" />

                <div className="mb-10">
                    <div className="mt-8 mb-12">
                        <p className="mb-6 text-lg">
                            Wir glauben, dass politische Entscheidungen für alle nachvollziehbar sein sollten. In einer Zeit, in der politische
                            Debatten oft in isolierten Echokammern stattfinden, möchten wir eine Plattform bieten, die mehr Transparenz schafft.
                        </p>

                        <p className="mb-6 text-lg">
                            Unser Ziel ist es, Bürgern einen einfachen Zugang zu den namentlichen Abstimmungen im Bundestag zu ermöglichen – wer hat
                            wie gestimmt, welche Positionen vertreten Abgeordnete und Parteien? Gleichzeitig möchten wir eine Plattform für den
                            Austausch schaffen: Hier können Bürger ihre Meinung zu den gleichen Themen äußern und miteinander diskutieren.
                        </p>

                        <p className="mb-6 text-lg">
                            Uns ist bewusst, dass unsere Umfragen nicht repräsentativ sind, da nur jene teilnehmen, die sich aktiv dazu entscheiden.
                            Dennoch glauben wir, dass es einen Unterschied machen kann, wenn mehr Menschen sich engagieren und aktiv ihre Meinung
                            einbringen. Daher liegt unser Fokus darauf, einen Raum für informierte Diskussionen zu bieten – einen Ort, an dem Menschen
                            sich mit politischen Entscheidungen auseinandersetzen, unterschiedliche Perspektiven kennenlernen und ihre Gedanken teilen
                            können.
                        </p>

                        <p className="mb-6 text-lg">
                            Warum sollten Sie mitmachen? Weil Demokratie vom Austausch lebt. Weil es wichtig ist, zu verstehen, wie politische
                            Entscheidungen getroffen werden. Und weil Ihre Meinung zählt – nicht als statistische Erhebung, sondern als Teil eines
                            offenen Dialogs, der uns alle weiterbringt.
                        </p>

                        <p className="text-lg">
                            Informieren Sie sich. Diskutieren Sie mit. Teilen Sie Ihre Gedanken und bringen Sie neue Perspektiven ein. Gemeinsam
                            können wir eine Plattform schaffen, die politische Prozesse verständlicher macht und den Dialog zwischen Bürgern stärkt.
                        </p>
                    </div>

                    <h2 className="mb-6 text-3xl font-bold tracking-tighter">FAQ</h2>

                    <Accordion type="single" collapsible className="mb-12">
                        {faqItems.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left text-lg font-bold">{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="py-2 text-base">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </AppLayout>
    );
}
