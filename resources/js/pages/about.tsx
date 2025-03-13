import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Vote } from '@/types/vote';
import { Head } from '@inertiajs/react';

// Update the interface for the page props
interface PageProps {
    votes: Vote[];
    [key: string]: any; // Add index signature
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Über uns',
        href: '/about',
    },
];

// FAQ items
const faqItems = [
    {
        question: 'Was ist der Zweck dieser Plattform?',
        answer: 'Unsere Plattform ermöglicht es Benutzern, an Abstimmungen teilzunehmen und ihre Meinung zu verschiedenen Themen zu teilen.',
    },
    {
        question: 'Wie kann ich an einer Abstimmung teilnehmen?',
        answer: 'Um an einer Abstimmung teilzunehmen, müssen Sie sich anmelden und dann auf die gewünschte Abstimmung klicken. Dort können Sie Ihre Stimme abgeben.',
    },
    {
        question: 'Sind meine Abstimmungen anonym?',
        answer: 'Ja, alle Abstimmungen sind anonym. Wir sammeln keine persönlichen Daten, die mit Ihrer Stimme verknüpft werden können.',
    },
    {
        question: 'Wie oft werden neue Abstimmungen hinzugefügt?',
        answer: 'Wir fügen regelmäßig neue Abstimmungen hinzu, abhängig von aktuellen Themen und Feedback unserer Community.',
    },
    {
        question: 'Kann ich eigene Abstimmungsthemen vorschlagen?',
        answer: 'Ja, registrierte Benutzer können über das Kontaktformular Vorschläge für neue Abstimmungsthemen einreichen.',
    },
];

export default function About() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Über uns" />

            <div className="container mx-auto max-w-7xl px-4 py-8">
                <section className="mt-6 flex w-full max-w-7xl items-center justify-center">
                    <div className="container px-4 md:px-8">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-3xl">Über diese Plattform</h1>

                        <div className="mt-8 mb-12">
                            <p className="mb-6 text-lg">
                                Wir glauben, dass jede Stimme zählt. In einer Zeit, in der öffentliche Debatten oft von den lautesten Stimmen dominiert werden, 
                                haben wir eine Plattform geschaffen, die ein klares, unverfälschtes Bild der gesellschaftlichen Meinung vermittelt.
                            </p>
                            
                            <p className="mb-6 text-lg">
                                Unsere Vision ist einfach: Eine demokratische Plattform, auf der jeder Bürger seine Meinung zu wichtigen Themen äußern kann – 
                                transparent, inklusiv und ohne Verzerrung. Kein Rauschen, keine Filterblasen, nur das echte Meinungsbild der Gesellschaft.
                            </p>
                            
                            <p className="mb-6 text-lg">
                                Als Teilnehmer auf unserer Plattform werden Sie Teil einer wachsenden Community, die den demokratischen Diskurs bereichert. 
                                Ihre Stimme trägt dazu bei, ein repräsentatives Bild zu zeichnen und die Kluft zwischen Bürgern und politischen Entscheidungsträgern zu überbrücken.
                            </p>
                            
                            <p className="mb-6 text-lg">
                                Warum sollten Sie mitmachen? Weil gemeinsam unsere Stimmen stärker sind. Weil Demokratie davon lebt, dass Menschen sich beteiligen. 
                                Und weil Ihre Meinung wirklich zählt – nicht nur als einzelne Stimme, sondern als Teil eines größeren Ganzen, das wir sichtbar machen wollen.
                            </p>
                            
                            <p className="text-lg">
                                Machen Sie mit. Stimmen Sie ab. Seien Sie Teil einer Bewegung, die Transparenz und echte Repräsentation in den Mittelpunkt stellt.
                            </p>
                        </div>

                        <h2 className="mb-6 text-3xl font-bold tracking-tighter sm:text-4xl md:text-3xl">FAQ</h2>

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
                </section>
            </div>
        </AppLayout>
    );
}
