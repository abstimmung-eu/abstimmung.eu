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
    {
        question: 'Wie kann ich an einer Abstimmung teilnehmen?',
        answer: 'Um an einer Abstimmung teilzunehmen, müssen Sie sich anmelden. Bei der Anmeldung werden demographische Daten erfasst, wie Alter, Geschlecht, Politische Ausrichtung und Bundesland. Dies dient dazu eine Auswertung der Abstimmungen zu ermöglichen. Die Abstimmung selbst ist anonym und es kann kein Rückschluss auf Ihre Person oder Ihre Meinung geschlossen werden.',
    },
    {
        question: 'Warum muss ich mich anmelden?',
        answer: 'Die Anmeldung dient dazu, eine gute Qualität der Abstimmungen zu gewährleisten und hilft dabei, mehrfach abstimmende Personen zu reduzieren.',
    },
    {
        question: 'Welche Daten werden bei der Anmeldung gesammelt?',
        answer: 'Bei der Anmeldung werden demographische Daten erfasst, wie Alter, Geschlecht, Politische Ausrichtung und Bundesland. Dies dient dazu eine Auswertung der Abstimmungen zu ermöglichen. Die Abstimmung selbst ist anonym und es kann kein Rückschluss auf Ihre Person oder Ihre Meinung geschlossen werden.',
    },
    {
        question: 'Kann ich meine Angaben ändern?',
        answer: 'Ja, Sie können Ihre Angaben jederzeit ändern. Dazu müssen Sie sich nur erneut anmelden und Ihre Daten in den Einstellungen aktualisieren.',
    },
    {
        question: 'Ist die Abstimmung anonym?',
        answer: 'Ja, die Abstimmung ist anonym. Es kann kein Rückschluss auf Ihre Person oder Ihre Meinung geschlossen werden. Das Abstimmungsergebnis wird getrennt von Ihren persönlichen Daten gespeichert und aggregiert, so dass keine Rückschlüsse auf Ihre Person oder Ihre Meinung geschlossen werden können. Es kann keiner, auch nicht wir, herausfinden, wie Sie abgestimmt haben.',
    },
    {
        question: 'Kann ich meine Abstimmung rückgängig machen?',
        answer: 'Es ist nicht möglich, eine abgegebene Stimme rückgängig zu machen oder zu ändern, da die Abstimmung anonym ist und wir nicht wissen, wie Sie abgestimmt haben.',
    },
    {
        question: 'Wie oft werden neue Abstimmungen hinzugefügt?',
        answer: 'Sobald eine namentliche Abstimmung des Bundestages erfolgt ist, wird diese auf unserer Plattform veröffentlicht.',
    },
    {
        question: 'Kann ich eigene Abstimmungsthemen vorschlagen?',
        answer: 'Wir planen in Zukunft eine Funktion für Vorschläge für neue Abstimmungsthemen.',
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
                            Wir glauben, dass politische Entscheidungen für alle nachvollziehbar sein sollten. In einer Zeit, in der politische Debatten oft in isolierten Echokammern stattfinden, möchten wir eine Plattform bieten, die mehr Transparenz schafft.
                        </p>

                        <p className="mb-6 text-lg">
                            Unser Ziel ist es, Bürgern einen einfachen Zugang zu den namentlichen Abstimmungen im Bundestag zu ermöglichen – wer hat wie gestimmt, welche Positionen vertreten Abgeordnete und Parteien? Gleichzeitig möchten wir eine Plattform für den Austausch schaffen: Hier können Bürger ihre Meinung zu den gleichen Themen äußern und miteinander diskutieren.
                        </p>

                        <p className="mb-6 text-lg">
                            Uns ist bewusst, dass unsere Umfragen nicht repräsentativ sind, da nur jene teilnehmen, die sich aktiv dazu entscheiden. Dennoch glauben wir, dass es einen Unterschied machen kann, wenn mehr Menschen sich engagieren und aktiv ihre Meinung einbringen. Daher liegt unser Fokus darauf, einen Raum für informierte Diskussionen zu bieten – einen Ort, an dem Menschen sich mit politischen Entscheidungen auseinandersetzen, unterschiedliche Perspektiven kennenlernen und ihre Gedanken teilen können.
                        </p>

                        <p className="mb-6 text-lg">
                            Warum sollten Sie mitmachen? Weil Demokratie vom Austausch lebt. Weil es wichtig ist, zu verstehen, wie politische Entscheidungen getroffen werden. Und weil Ihre Meinung zählt – nicht als statistische Erhebung, sondern als Teil eines offenen Dialogs, der uns alle weiterbringt.
                        </p>

                        <p className="text-lg">
                            Informieren Sie sich. Diskutieren Sie mit. Teilen Sie Ihre Gedanken und bringen Sie neue Perspektiven ein. Gemeinsam können wir eine Plattform schaffen, die politische Prozesse verständlicher macht und den Dialog zwischen Bürgern stärkt.
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
