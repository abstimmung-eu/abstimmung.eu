import VoteResults from '@/components/member-votes-table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import VoteBar from '@/components/vote-bar';
import AppLayout from '@/layouts/app-layout';
import { loadDemographicData } from '@/lib/demographics';
import { SharedData } from '@/types';
import { type Vote } from '@/types/vote';
import { Head, Link, usePage } from '@inertiajs/react';
import { AlertCircle, BarChart, CheckCircle, ChevronLeft, Hand, Link2, Paperclip, ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import VoteComments from './comments';
import DemographicInputDialog from './demographics-input';

// Add interface to extend the Vote type with the missing properties
interface ExtendedVote extends Vote {
    reference: string;
    arguments_for: string | null;
    arguments_against: string | null;
    summary: string;
}

interface UserVoteParticipation {
    id: number;
    vote_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface VoteProps {
    vote: ExtendedVote;
    user_vote_participation: UserVoteParticipation | null;
    user_is_verified: boolean;
    user_votes_by_age_group: {
        [key: string]: {
            total: number;
            for: number;
            against: number;
            abstention?: number;
            for_percentage?: number;
            against_percentage?: number;
            abstention_percentage?: number;
        };
    };
    member_votes_by_group: {
        [key: string]: {
            total: number;
            for: number;
            against: number;
            abstention: number;
            for_percentage: number;
            against_percentage: number;
            abstention_percentage: number;
        };
    };
}

// Add this constant at the top of the file, after imports
const AGE_GROUP_LABELS: Record<string, string> = {
    '17_and_under': '≤ 17',
    '18_to_24': '18-24',
    '25_to_34': '25-34',
    '35_to_44': '35-44',
    '45_to_54': '45-54',
    '55_to_64': '55-64',
    '65_plus': '≥ 65',
};

function handleVote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const voteId = (form.elements.namedItem('vote_id') as HTMLInputElement).value;
    const votePosition = (form.elements.namedItem('vote_position') as HTMLInputElement).value;

    const demographicDialogEvent = new CustomEvent('open-demographic-dialog', {
        detail: { voteId, votePosition },
    });
    document.dispatchEvent(demographicDialogEvent);
    return;
}

// Add this hook for responsive design
function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        const listener = () => setMatches(media.matches);
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [matches, query]);

    return matches;
}

export default function Vote({ vote, user_vote_participation, user_votes_by_age_group, member_votes_by_group, user_is_verified }: VoteProps) {
    const { auth } = usePage<SharedData>().props;
    const [partyVotesOpen, setPartyVotesOpen] = useState(false);
    const [demographicsOpen, setDemographicsOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    // Party vote results content - reused for both dialog and drawer
    const VoteResultsByPartyContent = () => (
        <>
            <div className="flex items-center gap-4 border-b pb-4">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm">Dafür</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Dagegen</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                    <span className="text-sm">Enthaltung</span>
                </div>
            </div>
            {member_votes_by_group && (
                <div className="my-6 space-y-4">
                    {Object.entries(member_votes_by_group).map(([group, votes]) => (
                        <VoteBar
                            key={group}
                            data={{
                                label: group,
                                total: votes.total,
                                for: votes.for,
                                against: votes.against,
                                abstention: votes.abstention,
                                for_percentage: votes.for_percentage,
                                against_percentage: votes.against_percentage,
                                abstention_percentage: votes.abstention_percentage,
                            }}
                            className="mb-3"
                        />
                    ))}
                </div>
            )}
        </>
    );

    // Add the missing DemographicResultsContent component
    const DemographicResultsContent = () => (
        <>
            <div className="flex items-center gap-4 border-b pb-4">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm">Dafür</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Dagegen</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                    <span className="text-sm">Enthaltung</span>
                </div>
            </div>
            {user_votes_by_age_group && (
                <div className="my-6 space-y-4">
                    {Object.entries(user_votes_by_age_group).map(([ageGroupKey, ageGroup]) => (
                        <VoteBar
                            key={ageGroupKey}
                            data={{
                                label: AGE_GROUP_LABELS[ageGroupKey] || ageGroupKey,
                                total: ageGroup.total,
                                for: ageGroup.for,
                                against: ageGroup.against,
                                abstention: ageGroup.abstention || 0,
                                for_percentage: ageGroup.for_percentage || Math.round((ageGroup.for / ageGroup.total) * 100),
                                against_percentage: ageGroup.against_percentage || Math.round((ageGroup.against / ageGroup.total) * 100),
                                abstention_percentage:
                                    ageGroup.abstention_percentage || Math.round(((ageGroup.abstention || 0) / ageGroup.total) * 100),
                            }}
                            className="mb-3"
                        />
                    ))}
                </div>
            )}
        </>
    );

    return (
        <AppLayout>
            <Head title={vote.title} />
            <DemographicInputDialog />
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col space-y-8">
                    <Link href="/votes" className="text-muted-foreground hover:text-foreground flex items-center">
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Zurück zu allen Abstimmungen
                    </Link>

                    <div className="flex flex-col space-y-6">
                        <div className="flex flex-col gap-2">
                            <div className="text-muted-foreground text-sm font-medium md:text-base">
                                <time dateTime={vote.vote_date}>
                                    {new Date(vote.vote_date).toLocaleDateString('de-DE', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </time>
                            </div>
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{vote.title}</h1>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {vote.categories.map((category) => (
                                    <Badge variant="outline" className="rounded-full text-sm" key={category.id}>
                                        {category.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl md:text-2xl">Inhalt der Abstimmung</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    {vote.summary.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            {index < vote.summary.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </div>

                                <Accordion type="multiple" className="mb-4">
                                    <AccordionItem value="description">
                                        <AccordionTrigger className="text-base">Zusammenfassung</AccordionTrigger>
                                        <AccordionContent className="text-base">
                                            {vote.description.split('\n').map((line, index) => (
                                                <React.Fragment key={index}>
                                                    {line}
                                                    {index < vote.description.split('\n').length - 1 && <br />}
                                                </React.Fragment>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>

                                    {vote.arguments_for && (
                                        <AccordionItem value="arguments-for">
                                            <AccordionTrigger className="text-base">Argumente dafür</AccordionTrigger>
                                            <AccordionContent className="text-base">
                                                <p>{vote.arguments_for}</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )}

                                    {vote.arguments_against && (
                                        <AccordionItem value="arguments-against">
                                            <AccordionTrigger className="text-base">Argumente dagegen</AccordionTrigger>
                                            <AccordionContent className="text-base">
                                                <p>{vote.arguments_against}</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )}
                                </Accordion>

                                <div className="text-muted-foreground mt-4 flex flex-col gap-2 text-sm md:flex-row">
                                    <span className="hidden sm:block">Quellen:</span>
                                    <span className="flex items-center gap-1">
                                        <Link2 className="h-4 w-4" />
                                        <a href={vote.url} target="_blank" rel="noopener noreferrer">
                                            Link zum Bundestag
                                        </a>
                                    </span>
                                    {vote.documents.map((document) => (
                                        <span key={document.id} className="flex items-center gap-1">
                                            <Paperclip className="h-4 w-4" />
                                            <a href={document.url} target="_blank" rel="noopener noreferrer">
                                                {document.title}
                                            </a>
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-6 md:flex-row md:flex-wrap">
                            <Card className="flex-1 md:basis-[calc(50%-12px)]">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Abstimmung im Parlament</CardTitle>
                                    <CardDescription className="text-sm">Wie Abgeordnete abgestimmt haben</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <VoteBar
                                                data={{
                                                    label: 'Gesamtergebnis',
                                                    total: vote.member_vote_stats.total_votes,
                                                    for: vote.member_vote_stats.total_yes_votes,
                                                    against: vote.member_vote_stats.total_no_votes,
                                                    abstention: vote.member_vote_stats.total_abstention_votes,
                                                    for_percentage: vote.member_vote_stats.total_yes_votes_percentage,
                                                    against_percentage: vote.member_vote_stats.total_no_votes_percentage,
                                                    abstention_percentage: vote.member_vote_stats.total_abstention_votes_percentage,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>
                                            Abgegebene Stimmen: {vote.member_vote_stats.total_votes}. Nicht abgestimmt:{' '}
                                            {vote.member_vote_stats.total_did_not_vote}
                                        </span>
                                    </div>

                                    {/* Button to open dialog/drawer */}
                                    <Button variant="outline" className="mt-4" onClick={() => setPartyVotesOpen(true)}>
                                        <BarChart className="mr-2 h-4 w-4" />
                                        Abstimmung nach Fraktion ansehen
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="flex-1 md:basis-[calc(50%-12px)]">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Stimmen auf der Plattform</CardTitle>
                                    <CardDescription className="text-sm">Wie Bürger auf diese Plattform gestimmt haben</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <VoteBar
                                                data={{
                                                    label: 'Gesamtergebnis',
                                                    total: vote.total_user_votes,
                                                    for: vote.total_user_yes_votes,
                                                    against: vote.total_user_no_votes,
                                                    abstention: vote.total_user_abstain_votes,
                                                    for_percentage: Math.round(vote.total_user_yes_votes_percentage),
                                                    against_percentage: Math.round(vote.total_user_no_votes_percentage),
                                                    abstention_percentage: Math.round(vote.total_user_abstain_votes_percentage),
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>Abgegebene Stimmen: {vote.total_user_votes}</span>
                                    </div>

                                    {/* Button to open demographics dialog/drawer */}
                                    {user_votes_by_age_group !== null ? (
                                        <Button variant="outline" className="mt-4" onClick={() => setDemographicsOpen(true)}>
                                            <BarChart className="mr-2 h-4 w-4" />
                                            Demografische Aufteilung ansehen
                                        </Button>
                                    ) : (
                                        <p className="text-muted-foreground mt-2 text-sm">
                                            Es sind zu wenig Stimmen abgegeben worden, um eine demografische Aufteilung anzuzeigen. Sobald mehr
                                            Stimmen abgegeben worden sind, wird diese Information hier angezeigt.
                                        </p>
                                    )}

                                    {/* User is not verified */}
                                    {auth.user && user_vote_participation === null && !user_is_verified && (
                                        <p className="text-muted-foreground mt-2 text-sm">
                                            <Link href={route('profile.edit')} className="text-blue-800 hover:underline dark:text-blue-400">
                                                Verifizieren Sie Ihre E-Mail-Adresse und Ihr Telefon
                                            </Link>
                                            , um Ihre Stimme abzugeben.
                                        </p>
                                    )}

                                    {auth.user && user_vote_participation === null && user_is_verified && (
                                        <>
                                            <div className="mt-2">
                                                <div className="flex flex-col gap-1">
                                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                                        <div className="w-full">
                                                            <form onSubmit={handleVote} className="w-full">
                                                                <input type="hidden" name="vote_id" value={vote.id} />
                                                                <input type="hidden" name="vote_position" value="for" />
                                                                <Button
                                                                    variant="outline"
                                                                    className="h-10 w-full cursor-pointer rounded-sm border-green-200 bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 dark:hover:text-green-300"
                                                                >
                                                                    <ThumbsUp className="mr-1 h-4 w-4" />
                                                                    <span>
                                                                        Dafür
                                                                        <span className="inline sm:inline md:hidden lg:inline"> stimmen</span>
                                                                    </span>
                                                                </Button>
                                                            </form>
                                                        </div>
                                                        <div className="w-full">
                                                            <form onSubmit={handleVote} className="w-full">
                                                                <input type="hidden" name="vote_id" value={vote.id} />
                                                                <input type="hidden" name="vote_position" value="against" />
                                                                <Button
                                                                    variant="outline"
                                                                    className="h-10 w-full cursor-pointer rounded-sm border-red-200 bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-300"
                                                                >
                                                                    <ThumbsDown className="mr-1 h-4 w-4" />
                                                                    <span>
                                                                        Dagegen
                                                                        <span className="inline sm:inline md:hidden lg:inline"> stimmen</span>
                                                                    </span>
                                                                </Button>
                                                            </form>
                                                        </div>
                                                        <div className="w-full">
                                                            <form onSubmit={handleVote} className="w-full">
                                                                <input type="hidden" name="vote_id" value={vote.id} />
                                                                <input type="hidden" name="vote_position" value="abstention" />
                                                                <Button
                                                                    variant="outline"
                                                                    className="h-10 w-full cursor-pointer rounded-sm border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                                                                >
                                                                    <Hand className="mr-1 h-4 w-4" /> Enthaltung
                                                                </Button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {auth.user == null && (
                                        <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
                                            <AlertCircle className="h-3 w-3" />
                                            <span>
                                                <Link href="/login" className="text-blue-800 hover:underline">
                                                    Melden Sie sich
                                                </Link>{' '}
                                                an, um Ihre Stimme abzugeben.
                                            </span>
                                        </div>
                                    )}

                                    {user_vote_participation && (
                                        <Alert variant="success" className="mt-2 bg-green-50 dark:bg-green-950/30 dark:text-gray-100">
                                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            <span>
                                                Sie haben am{' '}
                                                {new Date(user_vote_participation.created_at).toLocaleDateString('de-DE', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}{' '}
                                                an dieser Abstimmung teilgenommen.
                                            </span>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Stimmen der Abgeordneten</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <VoteResults vote={vote} />
                            </CardContent>
                        </Card>

                        <VoteComments vote={vote} />
                    </div>
                </div>
            </div>

            {/* Responsive dialog/drawer for party votes */}
            {isDesktop ? (
                <Dialog open={partyVotesOpen} onOpenChange={setPartyVotesOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Abstimmung nach Fraktion</DialogTitle>
                            <DialogDescription>Wie die verschiedenen Fraktionen abgestimmt haben</DialogDescription>
                        </DialogHeader>
                        <div className="max-h-[60vh] overflow-y-auto px-1">
                            <VoteResultsByPartyContent />
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setPartyVotesOpen(false)}>Schließen</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ) : (
                <Drawer open={partyVotesOpen} onOpenChange={setPartyVotesOpen}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Abstimmung nach Fraktion</DrawerTitle>
                            <DrawerDescription>Wie die verschiedenen Fraktionen abgestimmt haben</DrawerDescription>
                        </DrawerHeader>
                        <div className="max-h-[50vh] overflow-y-auto px-4">
                            <VoteResultsByPartyContent />
                        </div>
                        <DrawerFooter>
                            <Button onClick={() => setPartyVotesOpen(false)}>Schließen</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            )}

            {/* Responsive dialog/drawer for demographics */}
            {isDesktop ? (
                <Dialog open={demographicsOpen} onOpenChange={setDemographicsOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Demografische Aufteilung</DialogTitle>
                            <DialogDescription>Abstimmungsergebnisse nach Altersgruppen</DialogDescription>
                        </DialogHeader>
                        <div className="max-h-[60vh] overflow-y-auto px-1">
                            <DemographicResultsContent />
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setDemographicsOpen(false)}>Schließen</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ) : (
                <Drawer open={demographicsOpen} onOpenChange={setDemographicsOpen}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Demografische Aufteilung</DrawerTitle>
                            <DrawerDescription>Abstimmungsergebnisse nach Altersgruppen</DrawerDescription>
                        </DrawerHeader>
                        <div className="max-h-[50vh] overflow-y-auto px-4">
                            <DemographicResultsContent />
                        </div>
                        <DrawerFooter>
                            <Button onClick={() => setDemographicsOpen(false)}>Schließen</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            )}
        </AppLayout>
    );
}
