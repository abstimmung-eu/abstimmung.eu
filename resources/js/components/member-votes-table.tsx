import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Vote } from '@/types/vote';
import { ChevronLeft, ChevronRight, Link2, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

type SortField = 'name' | 'vote_position' | 'group';
type SortOrder = 'asc' | 'desc';

export default function VoteResults({ vote }: { vote: Vote }) {
    // Sorting state
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    // Filtering state
    const [nameFilter, setNameFilter] = useState('');
    const [positionFilter, setPositionFilter] = useState('all');
    const [groupFilter, setGroupFilter] = useState('all');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Get unique groups for the filter dropdown
    const uniqueGroups = useMemo(() => {
        const groups = vote.member_votes
            .map((mv) => mv.group)
            .filter((group, index, self) => group && self.indexOf(group) === index)
            .sort();
        return groups;
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

    // Add a mapping function to convert between UI labels and data values
    const getVotePositionValue = (uiPosition: string): string => {
        switch (uiPosition) {
            case 'for':
                return 'Ja';
            case 'against':
                return 'Nein';
            case 'abstention':
                return 'Enthaltung';
            case 'did_not_vote':
                return 'Nicht abgestimmt';
            default:
                return uiPosition;
        }
    };

    // Filtered and sorted member votes
    const filteredAndSortedVotes = useMemo(() => {
        let result = [...vote.member_votes];

        // Apply filters
        if (nameFilter) {
            const filterLower = nameFilter.toLowerCase();
            result = result.filter((mv) => `${mv.first_name} ${mv.last_name}`.toLowerCase().includes(filterLower));
        }

        if (positionFilter && positionFilter !== 'all') {
            const dataPosition = positionFilter; // This is now the data value
            result = result.filter((mv) => {
                // Compare against the actual data value in the member vote
                return mv.vote_position === dataPosition;
            });
        }

        if (groupFilter && groupFilter !== 'all') {
            result = result.filter((mv) => mv.group === groupFilter);
        }

        // Apply sorting
        result.sort((a, b) => {
            let comparison = 0;
            if (sortField === 'name') {
                const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                comparison = nameA.localeCompare(nameB);
            } else if (sortField === 'vote_position') {
                comparison = a.vote_position.localeCompare(b.vote_position);
            } else if (sortField === 'group') {
                // Sort by group name
                const groupA = (a.group || '').toLowerCase();
                const groupB = (b.group || '').toLowerCase();
                comparison = groupA.localeCompare(groupB);
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [vote.member_votes, nameFilter, positionFilter, groupFilter, sortField, sortOrder]);

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

    // Check if any filters are active
    const filtersActive = nameFilter || positionFilter !== 'all' || groupFilter !== 'all';

    return (
        <div className="bg-white dark:border-gray-800 dark:bg-gray-800">
            <div>
                {/* Filters and pagination size selector */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex w-full items-center md:w-auto">
                            <div className="relative flex-1">
                                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Name suchen..."
                                    className="pl-9"
                                    value={nameFilter}
                                    onChange={(e) => {
                                        setNameFilter(e.target.value);
                                        setCurrentPage(1); // Reset to first page on filter change
                                    }}
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-auto">
                            <Select
                                value={positionFilter}
                                onValueChange={(value) => {
                                    setPositionFilter(value);
                                    setCurrentPage(1); // Reset to first page on filter change
                                }}
                            >
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Abstimmung" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Alle</SelectItem>
                                    <SelectItem value="for">Dafür</SelectItem>
                                    <SelectItem value="against">Gegen</SelectItem>
                                    <SelectItem value="abstention">Enthaltung</SelectItem>
                                    <SelectItem value="did_not_vote">Nicht abgestimmt</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full md:w-auto">
                            <Select
                                value={groupFilter}
                                onValueChange={(value) => {
                                    setGroupFilter(value);
                                    setCurrentPage(1); // Reset to first page on filter change
                                }}
                            >
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

                        {filtersActive && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setNameFilter('');
                                    setPositionFilter('all');
                                    setGroupFilter('all');
                                    setCurrentPage(1); // Reset to first page
                                }}
                            >
                                Filter zurücksetzen
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Zeige</span>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => {
                                setPageSize(parseInt(value));
                                setCurrentPage(1); // Reset to first page on page size change
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
                                    <TableCell>
                                        <div className="flex items-center">
                                            {memberVote.vote_position === 'for' && <span className="mr-2 h-3 w-3 rounded-full bg-green-500"></span>}
                                            {memberVote.vote_position === 'against' && <span className="mr-2 h-3 w-3 rounded-full bg-red-500"></span>}
                                            {memberVote.vote_position === 'abstention' && (
                                                <span className="mr-2 h-3 w-3 rounded-full bg-gray-400"></span>
                                            )}
                                            {memberVote.vote_position === 'did_not_vote' && (
                                                <span className="mr-2 h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                            )}
                                            {getVotePositionValue(memberVote.vote_position)}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
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

                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Show pages around current page
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => goToPage(pageNum)}
                                    className="h-8 w-8 p-0"
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}

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
        </div>
    );
}
