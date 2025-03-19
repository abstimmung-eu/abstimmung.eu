import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { VoteCard } from '@/components/vote-card';
import AppLayout from '@/layouts/app-layout';
import { type Vote } from '@/types/vote';
import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import React, { FormEvent, useState } from 'react';

interface VotesProps {
    votes: {
        data: {
            [key: string]: Vote[];
        };
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    filters?: {
        search?: string;
    };
}

export default function Votes({ votes, filters = {} }: VotesProps) {
    // Check if votes and meta exist
    const hasMultiplePages = votes?.last_page > 1;
    const showPagination = hasMultiplePages && votes?.links;

    console.log(votes);

    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get('/votes', { search: searchQuery }, { preserveState: true });
    };

    const clearSearch = () => {
        setSearchQuery('');
        router.get('/votes', {}, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Abstimmungen" />

            <div className="container mx-auto max-w-7xl px-4 py-8">
                <PageHeader title="Abstimmungen" description="Verfolge aktuelle Abstimmungen im Bundestag." />

                <div className="mb-10">
                    <form onSubmit={handleSearch}>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Search className="h-4 w-4" />
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Nach Abstimmungen suchen..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-10 w-full border-slate-200 pr-10 pl-10 shadow-sm transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-600"
                                        aria-label="Suche löschen"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M18 6L6 18M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2 sm:flex-shrink-0">
                                <Button type="submit" className="h-10 flex-1 px-4 shadow-sm sm:flex-auto sm:px-5">
                                    Suchen
                                </Button>
                                {filters.search && (
                                    <Button type="button" variant="outline" onClick={clearSearch} className="h-10 flex-1 sm:flex-auto">
                                        Zurücksetzen
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="space-y-8">
                    <div className="grid gap-4">
                        {Object.keys(votes.data).length > 0 ? (
                            Object.keys(votes.data).map((date) => (
                                <React.Fragment key={date}>
                                    <div className="my-4 flex items-center gap-4">
                                        <h2 className="text-lg font-semibold whitespace-nowrap">
                                            {new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </h2>
                                        <hr className="flex-grow border-t border-gray-200" />
                                    </div>
                                    {votes.data[date].map((vote) => (
                                        <VoteCard key={vote.id} vote={vote} />
                                    ))}
                                </React.Fragment>
                            ))
                        ) : (
                            <div className="rounded-lg border border-dashed p-10 text-center">
                                <p className="text-muted-foreground mb-3">Keine Abstimmungen gefunden.</p>
                                {filters.search && (
                                    <Button variant="outline" size="sm" onClick={clearSearch} className="mt-2">
                                        Alle Abstimmungen anzeigen
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {showPagination && (
                        <div className="mt-8">
                            <Pagination>
                                <PaginationContent>
                                    {votes.prev_page_url !== null && (
                                        <PaginationItem key={votes.prev_page_url}>
                                            <PaginationPrevious href={votes.prev_page_url} title="Vorherige Seite" />
                                        </PaginationItem>
                                    )}

                                    {votes.links.map((link, index) => {
                                        if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                                            return null;
                                        }

                                        return (
                                            <PaginationItem key={link.label}>
                                                <PaginationLink href={link.url || '#'} isActive={link.active}>
                                                    {link.label}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}

                                    {votes.next_page_url !== null && (
                                        <PaginationItem key={votes.next_page_url}>
                                            <PaginationNext href={votes.next_page_url} title="Nächste Seite" />
                                        </PaginationItem>
                                    )}
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
