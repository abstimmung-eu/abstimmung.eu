import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Vote } from '@/types/vote';
import { ChevronLeft, ChevronRight, Link2, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

type SortField = 'name' | 'vote_position' | 'group' | 'state';
type SortOrder = 'asc' | 'desc';
type FilterState = {
    name: string;
    position: string;
    group: string;
    state: string;
};

// Vote position mapping between UI labels and data values
const VOTE_POSITIONS = {
    for: 'Ja',
    against: 'Nein',
    abstention: 'Enthaltung',
    did_not_vote: 'Nicht abgestimmt',
};

export default function VoteResults({ vote }: { vote: Vote }) {
    // Sorting state
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    // Filtering state
    const [filters, setFilters] = useState<FilterState>({
        name: '',
        position: 'all',
        group: 'all',
        state: 'all',
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Extract unique values for filter dropdowns
    const { uniqueGroups, uniqueStates } = useMemo(() => {
        const groups = vote.member_votes
            .map((mv) => mv.group)
            .filter((group, index, self) => group && self.indexOf(group) === index)
            .sort();

        const states = vote.member_votes
            .map((mv) => mv.state)
            .filter((state, index, self) => state && self.indexOf(state) === index)
            .sort();

        return { uniqueGroups: groups, uniqueStates: states };
    }, [vote.member_votes]);

    // Toggle sort order or change sort field
    const handleSort = (field: SortField) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    // Get vote position display value
    const getVotePositionValue = (position: string): string => {
        return VOTE_POSITIONS[position as keyof typeof VOTE_POSITIONS] || position;
    };

    // Handle filter changes
    const updateFilter = (key: keyof FilterState, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to first page on filter change
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({
            name: '',
            position: 'all',
            group: 'all',
            state: 'all',
        });
        setCurrentPage(1);
    };

    // Filtered and sorted member votes
    const filteredAndSortedVotes = useMemo(() => {
        let result = [...vote.member_votes];

        // Apply filters
        if (filters.name) {
            const filterLower = filters.name.toLowerCase();
            result = result.filter((mv) => `${mv.first_name} ${mv.last_name}`.toLowerCase().includes(filterLower));
        }

        if (filters.position !== 'all') {
            result = result.filter((mv) => mv.vote_position === filters.position);
        }

        if (filters.group !== 'all') {
            result = result.filter((mv) => mv.group === filters.group);
        }

        if (filters.state !== 'all') {
            result = result.filter((mv) => mv.state === filters.state);
        }

        // Apply sorting
        result.sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case 'name': {
                    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                    comparison = nameA.localeCompare(nameB);
                    break;
                }
                case 'vote_position': {
                    comparison = a.vote_position.localeCompare(b.vote_position);
                    break;
                }
                case 'group': {
                    const groupA = (a.group || '').toLowerCase();
                    const groupB = (b.group || '').toLowerCase();
                    comparison = groupA.localeCompare(groupB);
                    break;
                }
                case 'state': {
                    const stateA = (a.state || '').toLowerCase();
                    const stateB = (b.state || '').toLowerCase();
                    comparison = stateA.localeCompare(stateB);
                    break;
                }
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [vote.member_votes, filters, sortField, sortOrder]);

    // Calculate pagination values
    const totalItems = filteredAndSortedVotes.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    // Ensure current page is valid after filters change
    if (currentPage > totalPages) {
        setCurrentPage(totalPages);
    }

    // Get paginated data
    const paginatedVotes = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredAndSortedVotes.slice(startIndex, startIndex + pageSize);
    }, [filteredAndSortedVotes, currentPage, pageSize]);

    // Handle page change
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Get the sort direction indicator
    const getSortIndicator = (field: SortField) => {
        if (sortField !== field) return null;
        return sortOrder === 'asc' ? ' ↑' : ' ↓';
    };

    // Generate pagination buttons
    const renderPaginationButtons = () => {
        const buttons = [];
        let startPage = 1;
        let endPage = Math.min(5, totalPages);

        if (totalPages > 5) {
            if (currentPage <= 3) {
                // Near start
                endPage = 5;
            } else if (currentPage >= totalPages - 2) {
                // Near end
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                // Middle
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button key={i} variant={currentPage === i ? 'default' : 'outline'} size="sm" onClick={() => goToPage(i)} className="h-8 w-8 p-0">
                    {i}
                </Button>,
            );
        }

        return buttons;
    };

    // Check if any filters are active
    const filtersActive = filters.name || filters.position !== 'all' || filters.group !== 'all' || filters.state !== 'all';

    // Render vote position with colored indicator
    const renderVotePosition = (position: string) => (
        <div className="flex items-center">
            {position === 'for' && <span className="mr-2 h-3 w-3 rounded-full bg-green-500"></span>}
            {position === 'against' && <span className="mr-2 h-3 w-3 rounded-full bg-red-500"></span>}
            {position === 'abstention' && <span className="mr-2 h-3 w-3 rounded-full bg-gray-400"></span>}
            {position === 'did_not_vote' && <span className="mr-2 h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600"></span>}
            {getVotePositionValue(position)}
        </div>
    );

    return (
        <div>
            {/* Filters and pagination size selector */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Name search */}
                    <div className="flex w-full items-center md:w-auto">
                        <div className="relative flex-1">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Name suchen..."
                                className="pl-9"
                                value={filters.name}
                                onChange={(e) => updateFilter('name', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Position filter */}
                    <div className="w-full md:w-auto">
                        <Select value={filters.position} onValueChange={(value) => updateFilter('position', value)}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Abstimmung" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alle Stimmen</SelectItem>
                                <SelectItem value="for">Dafür</SelectItem>
                                <SelectItem value="against">Gegen</SelectItem>
                                <SelectItem value="abstention">Enthaltung</SelectItem>
                                <SelectItem value="did_not_vote">Nicht abgestimmt</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Group filter */}
                    <div className="w-full md:w-auto">
                        <Select value={filters.group} onValueChange={(value) => updateFilter('group', value)}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Fraktion" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alle Fraktionen</SelectItem>
                                {uniqueGroups.map((group) => (
                                    <SelectItem key={group} value={group}>
                                        {group}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* State filter */}
                    <div className="w-full md:w-auto">
                        <Select value={filters.state} onValueChange={(value) => updateFilter('state', value)}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Bundesland" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alle Bundesländer</SelectItem>
                                {uniqueStates.map((state) => (
                                    <SelectItem key={state} value={state}>
                                        {state}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Reset filters button */}
                    {filtersActive && (
                        <Button variant="outline" size="sm" onClick={resetFilters}>
                            Filter zurücksetzen
                        </Button>
                    )}
                </div>

                {/* Page size selector */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Zeige</span>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => {
                            setPageSize(parseInt(value));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[80px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-500 dark:text-gray-400">pro Seite</span>
                </div>
            </div>

            {/* Results table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                            Name {getSortIndicator('name')}
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('group')}>
                            Fraktion {getSortIndicator('group')}
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('vote_position')}>
                            Abstimmung {getSortIndicator('vote_position')}
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('state')}>
                            Bundesland {getSortIndicator('state')}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedVotes.length > 0 ? (
                        paginatedVotes.map((memberVote) => (
                            <TableRow key={memberVote.id}>
                                <TableCell className="font-medium">
                                    <span className="flex items-center gap-1">
                                        {memberVote.first_name} {memberVote.last_name}
                                        {memberVote.url && (
                                            <a href={memberVote.url} target="_blank" rel="noopener noreferrer">
                                                <Link2 className="h-4 w-4" />
                                            </a>
                                        )}
                                    </span>
                                </TableCell>
                                <TableCell>{memberVote.group || '–'}</TableCell>
                                <TableCell>{renderVotePosition(memberVote.vote_position)}</TableCell>
                                <TableCell>{memberVote.state || '–'}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                Keine Ergebnisse gefunden.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination controls */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {renderPaginationButtons()}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
