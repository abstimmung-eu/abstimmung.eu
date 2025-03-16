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
                <PageHeader
                    title="Über uns"
                />

                <div className="mb-10">
                    <div className="mt-8 mb-12">
                        <p className="mb-6 text-lg">
                            Wir glauben, dass jede Stimme zählt. In einer Zeit, in der öffentliche Debatten oft von den lautesten Stimmen dominiert
                            werden, haben wir eine Plattform geschaffen, mit dem Ziel ein klares, unverfälschtes Bild der gesellschaftlichen Meinung
                            vermittelt.
                        </p>

                        <p className="mb-6 text-lg">
                            Unsere Vision ist einfach: Eine demokratische Plattform, auf der jeder Bürger seine Meinung zu wichtigen Themen äußern kann – transparent, inklusiv und ohne Verzerrung. Damit diese Vision Wirklichkeit wird, benötigen wir eine kritische Masse an Teilnehmern. Je mehr Menschen sich beteiligen, desto repräsentativer wird unser gemeinsames Meinungsbild.
                        </p>

                        <p className="mb-6 text-lg">
                            Als Teilnehmer auf unserer Plattform werden Sie nicht nur Teil einer wachsenden Community, die den demokratischen Diskurs bereichert – Sie helfen aktiv dabei, diese Community zu vergrößern. Jede Person, die Sie einladen, verstärkt die Aussagekraft unserer Ergebnisse und bringt uns näher an ein wahrhaft repräsentatives Bild der Gesellschaft.
                        </p>

                        <p className="mb-6 text-lg">
                            Warum sollten Sie mitmachen? Weil gemeinsam unsere Stimmen stärker sind. Weil Demokratie davon lebt, dass Menschen sich
                            beteiligen. Und weil Ihre Meinung wirklich zählt – nicht nur als einzelne Stimme, sondern als wichtiger Teil unserer Gesellschaft, das wir sichtbar machen wollen.
                        </p>

                        <p className="text-lg">
                            Machen Sie mit. Stimmen Sie ab. Laden Sie Freunde, Familie und Kollegen ein. Teilen Sie unsere Plattform in Ihren Netzwerken. Nur gemeinsam können wir eine Bewegung schaffen, die groß genug ist, um Transparenz und echte Repräsentation in den Mittelpunkt zu stellen und Gehör zu finden.
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
