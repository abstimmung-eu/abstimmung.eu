import { PageHeader } from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Impressum',
        href: '/impressum',
    },
];

export default function Impressum() {
    // Get app name from shared props
    const { props } = usePage<SharedData>();
    const { name } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Impressum" />

            <div className="container mx-auto max-w-4xl px-4 py-8">
                <PageHeader title="Impressum" />

                <div className="mb-10">
                    <div className="mt-8 mb-12">
                        <h2 className="mb-4 text-2xl font-bold tracking-tighter">Angaben gemäß § 5 TMG</h2>
                        <div className="mb-6 text-lg">
                            <p>Maximilian Schöll & Simon Walter</p>
                            <p>Ailesbury Close</p>
                            <p>Dublin 4</p>
                            <p>Irland</p>
                        </div>

                        <h2 className="mb-4 text-2xl font-bold tracking-tighter">Kontakt</h2>
                        <div className="mb-6 text-lg">
                            <p>E-Mail: info@{name}</p>
                        </div>

                        <h2 className="mb-4 text-2xl font-bold tracking-tighter">
                            Hinweis zur Plattform der EU-Kommission zur Online-Streitbeilegung
                        </h2>
                        <p className="mb-6 text-lg">
                            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit. Die Plattform finden Sie unter
                            https://ec.europa.eu/consumers/odr/
                        </p>

                        <h2 className="mb-4 text-2xl font-bold tracking-tighter">Haftungsausschluss</h2>
                        <div className="mb-6 text-lg">
                            <p className="mb-4">
                                <strong>Verantwortlichkeit für eigene Inhalte:</strong> In unserer Rolle als Diensteanbieter sind wir entsprechend § 7
                                Abs.1 TMG nach den allgemeinen gesetzlichen Bestimmungen für die eigenen Inhalte auf dieser Website verantwortlich.
                                Gemäß §§ 8 bis 10 TMG besteht für uns als Diensteanbieter jedoch keine Verpflichtung, übermittelte oder gespeicherte
                                fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf rechtswidrige Aktivitäten hindeuten
                                könnten.
                            </p>
                            <p>
                                <strong>Verantwortlichkeit für externe Verweise:</strong> Auf unserem Internetangebot finden sich Links zu externen
                                Webseiten Dritter. Wir haben keinen Einfluss auf deren Inhalte. Die Verantwortung für die Inhalte der verlinkten
                                Seiten trägt ausschließlich der jeweilige Anbieter oder Betreiber dieser Seiten. Bei der erstmaligen Verlinkung wurden
                                die verlinkten Seiten auf mögliche Rechtsverstöße geprüft. Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen
                                Inhalte erkennbar.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-8">
                        <p className="mb-4 text-gray-600 italic">
                            Dieses Impressum wurde zuletzt am 17.03.2025 aktualisiert. Bei Fragen oder Anregungen kontaktieren Sie uns bitte unter den
                            oben angegebenen Kontaktdaten.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
