import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VoteCard } from '@/components/vote-card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Vote } from '@/types/vote';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChartPie, ChevronRight, CircleCheckBig, Newspaper } from 'lucide-react';

// Update the interface for the page props
interface PageProps {
    votes: Vote[];
    [key: string]: any; // Add index signature
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/',
    },
];

export default function Index() {
    // Type the usePage call with the PageProps interface
    const { votes } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />

            <section className="mt-6 flex w-full max-w-7xl items-center justify-center">
                <div className="container px-4 md:px-8">
                    <div className="grid items-center gap-6 rounded-lg bg-gradient-to-b from-blue-500 to-blue-800 p-6 shadow-lg shadow-blue-500/20 md:p-12 md:py-12 lg:grid-cols-2 lg:gap-12">
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-3xl">
                                    Zusammen für eine bessere Demokratie
                                </h1>
                                <p className="mb-6 max-w-[600px] text-white/90 md:text-xl">
                                    Verfolge Abstimmungen im deutschen Bundestag und mach deine Stimme sichtbar.
                                </p>

                                <div className="flex flex-col w-full sm:flex-row gap-3 sm:gap-2">
                                    <Link
                                        href="/about"
                                        className="group inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-md bg-white px-5 py-2 font-medium text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
                                    >
                                        <span className="whitespace-nowrap">Mehr erfahren</span>
                                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>

                                    <Link
                                        href="/votes"
                                        className="group inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-md bg-white px-5 py-2 font-medium text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
                                    >
                                        <span className="whitespace-nowrap">Abstimmungen anzeigen</span>
                                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section */}

            <section className="w-full max-w-7xl py-4 lg:py-16">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="md:text:3xl text-3xl font-bold tracking-tighter sm:text-4xl">Wie es funktioniert</h2>
                            <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Hier kannst du Abstimmungen verfolgen und deine Meinung anonym und sicher abgeben.
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="gap-4">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="grid gap-1">
                                    <CardTitle className="flex items-center gap-2">
                                        <Newspaper className="size-5" />
                                        Abstimmungen verfolgen
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p>Entdecke vergangene und bevorstehende Abstimmungen im Bundestag zu wichtigen Themen.</p>
                            </CardContent>
                        </Card>
                        <Card className="gap-4">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="grid gap-1">
                                    <CardTitle className="flex items-center gap-2">
                                        <CircleCheckBig className="size-5" />
                                        Deine Stimme abgeben
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p>Stimmen für dieselben Themen ab und vergleiche deine Meinung mit der des Parlamentarische Versammlung.</p>
                            </CardContent>
                        </Card>
                        <Card className="gap-4">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="grid gap-1">
                                    <CardTitle className="flex items-center gap-2">
                                        <ChartPie className="size-5" />
                                        Ergebnisse vergleichen
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p>Vergleichen Sie die Ergebnisse des Bundestags mit der öffentlichen Meinung.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Recent Votes Section */}

            <section className="flex w-full items-center justify-center bg-gray-100 dark:bg-gray-900 py-4 md:py-12 lg:py-16">
                <div className="container max-w-7xl px-4 md:px-6">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-3xl">Aktuelle Abstimmungen</h2>
                    <div className="mx-auto mt-8">
                        <div className="grid gap-6">
                            {votes.map((vote) => (
                                <VoteCard key={vote.uuid} vote={vote} />
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Link
                            href="/votes"
                            className="inline-flex h-11 items-center justify-center rounded-md bg-blue-500 px-5 py-2 font-medium text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg"
                        >
                            Alle Abstimmungen anzeigen
                        </Link>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
