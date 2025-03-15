import VoteResults from '@/components/member-votes-table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VoteBar from '@/components/vote-bar';
import AppLayout from '@/layouts/app-layout';
import { isDemographicDataEmpty, loadDemographicData, saveDemographicData } from '@/lib/demographics';
import { SharedData } from '@/types';
import { type Vote } from '@/types/vote';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, ChevronLeft, Hand, Link2, Paperclip, ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useState } from 'react';

// Add interface to extend the Vote type with the missing properties
interface ExtendedVote extends Vote {
    reference: string;
    arguments_for: string | null;
    arguments_against: string | null;
    summary: string;
}

interface UserVoteParticipation {
    id: number;
    vote_uuid: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface VoteProps {
    vote: ExtendedVote;
    user_vote_participation: UserVoteParticipation | null;
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
    const voteUuid = (form.elements.namedItem('vote_uuid') as HTMLInputElement).value;
    const votePosition = (form.elements.namedItem('vote_position') as HTMLInputElement).value;

    const demographicData = loadDemographicData();

    if (isDemographicDataEmpty()) {
        // Show dialog instead of console error
        const customEvent = new CustomEvent('open-demographic-dialog', {
            detail: { voteUuid, votePosition }
        });
        document.dispatchEvent(customEvent);
        return;
    }

    router.post(
        '/votes/cast',
        {
            vote_uuid: voteUuid,
            vote_position: votePosition,
            demographics: demographicData,
        },
        {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['user_vote_participation'] });
            },
        },
    );
}

// Add new DemographicDialog component within the file
function DemographicDialog() {
    const [open, setOpen] = useState(false);
    const [birthYear, setBirthYear] = useState<string>('');
    const [voteData, setVoteData] = useState<{voteUuid: string, votePosition: string} | null>(null);

    // Generate years for dropdown (from 1920 to current year)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1919 }, (_, i) => (currentYear - i).toString());

    React.useEffect(() => {
        const handleOpenDialog = (e: Event) => {
            const customEvent = e as CustomEvent;
            setVoteData(customEvent.detail);
            setOpen(true);
        };

        document.addEventListener('open-demographic-dialog', handleOpenDialog);
        return () => {
            document.removeEventListener('open-demographic-dialog', handleOpenDialog);
        };
    }, []);

    const handleSubmit = () => {
        if (!birthYear || !voteData) return;

        // Save the demographic data
        saveDemographicData({ birthyear: birthYear });

        // Submit the vote
        router.post(
            '/votes/cast',
            {
                vote_uuid: voteData.voteUuid,
                vote_position: voteData.votePosition,
                demographics: { birthyear: birthYear },
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['user_vote_participation'] });
                },
            },
        );

        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Demografische Daten benötigt</DialogTitle>
                    <DialogDescription>
                        Um abzustimmen, benötigen wir einige demografische Informationen. Diese werden anonymisiert gespeichert.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="birthYear" className="text-right">
                            Geburtsjahr
                        </Label>
                        <Select value={birthYear} onValueChange={setBirthYear}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Bitte wählen" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => setOpen(false)} variant="outline">
                        Abbrechen
                    </Button>
                    <Button onClick={handleSubmit} disabled={!birthYear}>
                        Speichern & Abstimmen
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Vote({ vote, user_vote_participation, user_votes_by_age_group, member_votes_by_group }: VoteProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout>
            <Head title={vote.title} />
            <DemographicDialog />
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
                                    <CardDescription className="text-sm">Wie Abgeordnete auf diese Richtlinie abgestimmt haben</CardDescription>
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
                                </CardContent>
                            </Card>

                            <Card className="flex-1 md:basis-[calc(50%-12px)]">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Öffentliche Meinung</CardTitle>
                                    <CardDescription className="text-sm">Wie EU-Bürger auf diese Plattform gestimmt haben</CardDescription>
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

                                    {auth.user && user_vote_participation === null && (
                                        <>
                                            <div className="mt-2">
                                                <div className="flex flex-col gap-1">
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div className="w-full">
                                                            <form onSubmit={handleVote} className="w-full">
                                                                <input type="hidden" name="vote_uuid" value={vote.uuid} />
                                                                <input type="hidden" name="vote_position" value="for" />
                                                                <Button
                                                                    variant="outline"
                                                                    className="h-10 w-full cursor-pointer rounded-sm border-green-200 bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-800"
                                                                >
                                                                    <ThumbsUp className="mr-1 h-4 w-4" /> Dafür stimmen
                                                                </Button>
                                                            </form>
                                                        </div>
                                                        <div className="w-full">
                                                            <form onSubmit={handleVote} className="w-full">
                                                                <input type="hidden" name="vote_uuid" value={vote.uuid} />
                                                                <input type="hidden" name="vote_position" value="against" />
                                                                <Button
                                                                    variant="outline"
                                                                    className="h-10 w-full cursor-pointer rounded-sm border-red-200 bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-800"
                                                                >
                                                                    <ThumbsDown className="mr-1 h-4 w-4" /> Dagegen stimmen
                                                                </Button>
                                                            </form>
                                                        </div>
                                                        <div className="w-full">
                                                            <form onSubmit={handleVote} className="w-full">
                                                                <input type="hidden" name="vote_uuid" value={vote.uuid} />
                                                                <input type="hidden" name="vote_position" value="abstention" />
                                                                <Button
                                                                    variant="outline"
                                                                    className="h-10 w-full cursor-pointer rounded-sm border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-50 hover:text-gray-800"
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
                            <CardContent>
                                <div className="flex flex-row gap-8">
                                    <div className="w-1/2">
                                        <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
                                            <h3 className="text-lg font-bold">Abstimmung nach Fraktion</h3>
                                            <div className="flex items-center gap-4">
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
                                        </div>
                                        {member_votes_by_group && (
                                            <div className="mt-3 space-y-2">
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
                                    </div>

                                    <div className="w-1/2">
                                        <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
                                            <span className="text-lg font-bold">Demografische Aufteilung</span>
                                            <div className="flex items-center gap-4">
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
                                        </div>
                                        {Object.entries(user_votes_by_age_group).map(([ageGroupKey, ageGroup]) => (
                                            <div key={ageGroupKey} className="mt-3 space-y-2">
                                                <VoteBar
                                                    data={{
                                                        label: AGE_GROUP_LABELS[ageGroupKey],
                                                        total: ageGroup.total,
                                                        for: ageGroup.for,
                                                        against: ageGroup.against,
                                                        abstention: ageGroup.abstention,
                                                        for_percentage: ageGroup.for_percentage,
                                                        against_percentage: ageGroup.against_percentage,
                                                        abstention_percentage: ageGroup.abstention_percentage,
                                                    }}
                                                    height="h-6"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Stimmen der Abgeordneten</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <VoteResults vote={vote} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
