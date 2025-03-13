import VoteResults from '@/components/member-votes-table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { type Vote } from '@/types/vote';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, ChevronLeft, Link2, Paperclip } from 'lucide-react';
import React from 'react';

// Add interface to extend the Vote type with the missing properties
interface ExtendedVote extends Vote {
    reference: string;
    arguments_for: string | null;
    arguments_against: string | null;
    summary: string;
    age_group_stats: {
        [key: string]: {
            total: number;
            yes: {
                count: number;
                percentage: number;
            };
            no: {
                count: number;
                percentage: number;
            };
            abstain: {
                count: number;
                percentage: number;
            };
        };
    };
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

    router.post('/votes/cast', {
        vote_uuid: voteUuid,
        vote_position: votePosition,
    });
}

export default function Vote({ vote, user_vote_participation }: VoteProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout>
            <Head title={vote.title} />
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col space-y-8">
                    <Link href="/votes" className="text-muted-foreground hover:text-foreground flex items-center">
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Zurück zu allen Abstimmungen
                    </Link>

                    <div className="flex flex-col space-y-6">
                        <div className="flex flex-col gap-2">
                            <div className="text-muted-foreground text-sm md:text-base font-medium">
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

                        <div className="flex flex-col md:flex-row md:flex-wrap gap-6">
                            <Card className="flex-1 md:basis-[calc(50%-12px)]">
                                <CardHeader>
                                    <CardTitle className="text-xl">Abstimmungsergebnisse im Parlament</CardTitle>
                                    <CardDescription className="text-sm">Wie Abgeordnete auf diese Richtlinie abgestimmt haben</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-3 w-3 bg-green-600"></div>
                                                    <span className="text-sm font-medium">Dafür</span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {vote.member_vote_stats.total_yes_votes} ({vote.member_vote_stats.total_yes_votes_percentage}%)
                                                </span>
                                            </div>
                                            <Progress
                                                value={vote.member_vote_stats.total_yes_votes_percentage}
                                                className="bg-muted h-2 rounded-none"
                                                indicatorClassName="bg-green-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-3 w-3 bg-red-600"></div>
                                                    <span className="text-sm font-medium">Dagegen</span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {vote.member_vote_stats.total_no_votes} ({vote.member_vote_stats.total_no_votes_percentage}%)
                                                </span>
                                            </div>
                                            <Progress
                                                value={vote.member_vote_stats.total_no_votes_percentage}
                                                className="bg-muted h-2 rounded-none"
                                                indicatorClassName="bg-red-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-3 w-3 bg-gray-400"></div>
                                                    <span className="text-sm font-medium">Enthaltung</span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {vote.member_vote_stats.total_abstention_votes} (
                                                    {vote.member_vote_stats.total_abstention_votes_percentage}%)
                                                </span>
                                            </div>
                                            <Progress
                                                value={vote.member_vote_stats.total_abstention_votes_percentage}
                                                className="bg-muted h-2 rounded-none"
                                                indicatorClassName="bg-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="text-muted-foreground mt-6 flex items-center gap-2 text-sm">
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
                                    <CardTitle className="text-xl">Öffentliche Meinung</CardTitle>
                                    <CardDescription className="text-sm">Wie EU-Bürger auf diese Plattform gestimmt haben</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-3 w-3 bg-green-600"></div>
                                                    <span className="text-sm font-medium">Dafür</span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {vote.total_user_yes_votes} ({Math.round(vote.total_user_yes_votes_percentage)}%)
                                                </span>
                                            </div>
                                            <Progress
                                                value={(vote.total_user_yes_votes / vote.total_user_votes) * 100}
                                                className="bg-muted h-2 rounded-none"
                                                indicatorClassName="bg-green-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-3 w-3 bg-red-600"></div>
                                                    <span className="text-sm font-medium">Dagegen</span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {vote.total_user_no_votes} ({Math.round(vote.total_user_no_votes_percentage)}%)
                                                </span>
                                            </div>
                                            <Progress
                                                value={(vote.total_user_no_votes / vote.total_user_votes) * 100}
                                                className="bg-muted h-2 rounded-none"
                                                indicatorClassName="bg-red-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-3 w-3 bg-gray-400"></div>
                                                    <span className="text-sm font-medium">Enthaltung</span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {vote.total_user_abstain_votes} ({Math.round(vote.total_user_abstain_votes_percentage)}%)
                                                </span>
                                            </div>
                                            <Progress
                                                value={vote.total_user_abstain_votes_percentage}
                                                className="bg-muted h-2 rounded-none"
                                                indicatorClassName="bg-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="text-muted-foreground mt-6 flex items-center gap-2 text-sm">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>Abgegebene Stimmen: {vote.total_user_votes}</span>
                                    </div>

                                    <div className="mt-4">
                                        <div className="border-t py-6">
                                            <div className="font-medium">Demografische Aufteilung</div>
                                            <div className="mt-1 space-y-1">
                                                {Object.entries(vote.age_group_stats).map(([ageGroupKey, ageGroup]) => (
                                                    <div key={ageGroupKey} className="flex items-center text-sm">
                                                        <div className="w-14">{AGE_GROUP_LABELS[ageGroupKey]}</div>
                                                        <div className="relative flex h-3 flex-1 items-center">
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div
                                                                        className="h-3 bg-green-600"
                                                                        style={{ width: `${ageGroup.yes.percentage}%` }}
                                                                    />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>
                                                                        Dafür: {ageGroup.yes.count} ({ageGroup.yes.percentage}%)
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="h-3 bg-red-600" style={{ width: `${ageGroup.no.percentage}%` }} />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>
                                                                        Dagegen: {ageGroup.no.count} ({ageGroup.no.percentage}%)
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div
                                                                        className="h-3 bg-gray-400"
                                                                        style={{ width: `${ageGroup.abstain.percentage}%` }}
                                                                    />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>
                                                                        Enthaltung: {ageGroup.abstain.count} ({ageGroup.abstain.percentage}%)
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                        <div className="text-muted-foreground w-18 text-right text-xs">
                                                            {ageGroup.total.toLocaleString('de-DE')} Stimmen
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
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
                                                                        className="h-8 w-full cursor-pointer rounded-sm border-green-200 bg-white text-green-700 hover:bg-green-50 hover:text-green-800"
                                                                    >
                                                                        Dafür stimmen
                                                                    </Button>
                                                                </form>
                                                            </div>
                                                            <div className="w-full">
                                                                <form onSubmit={handleVote} className="w-full">
                                                                    <input type="hidden" name="vote_uuid" value={vote.uuid} />
                                                                    <input type="hidden" name="vote_position" value="against" />
                                                                    <Button
                                                                        variant="outline"
                                                                        className="h-8 w-full cursor-pointer rounded-sm border-red-200 bg-white text-red-700 hover:bg-red-50 hover:text-red-800"
                                                                    >
                                                                        Dagegen stimmen
                                                                    </Button>
                                                                </form>
                                                            </div>
                                                            <div className="w-full">
                                                                <form onSubmit={handleVote} className="w-full">
                                                                    <input type="hidden" name="vote_uuid" value={vote.uuid} />
                                                                    <input type="hidden" name="vote_position" value="abstention" />
                                                                    <Button
                                                                        variant="outline"
                                                                        className="h-8 w-full cursor-pointer rounded-sm border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800"
                                                                    >
                                                                        Enthaltung
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
                                            <Alert variant="success" className="bg-green-50">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
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
                                    </div>
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
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
