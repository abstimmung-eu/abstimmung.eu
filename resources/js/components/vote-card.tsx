import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Vote, VoteCategory, VoteStatus } from '@/types/vote';
import { Link } from '@inertiajs/react';
import { AlertCircle, BarChart3, CalendarIcon, CheckCircle, Clock, MapPin, Users, XCircle } from 'lucide-react';

interface VoteCardProps {
    vote: Vote;
}

export function VoteCard({ vote }: VoteCardProps) {

    return (
        <Link href={`/votes/${vote.uuid}`} className="group block focus:outline-none">
            <Card className="overflow-hidden rounded-sm border-1 bg-white dark:bg-gray-800 py-0 transition-all duration-200 hover:shadow-md">
                <div className="flex flex-col md:flex-row">
                    {/* Left section - Main vote info */}
                    <div className="flex-1 p-6 md:p-8">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                {vote.categories.map((category) => (
                                    <Badge variant="outline" className="text-sm rounded-full" key={category.id}>
                                        {category.name}
                                    </Badge>
                                ))}
                        </div>

                        <h3 className="mb-3 text-xl font-semibold text-[#004494] dark:text-blue-300 transition-colors duration-200 group-hover:text-[#003472] dark:group-hover:text-blue-200 md:text-2xl">
                            {vote.title}
                        </h3>

                        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 md:text-base">{vote.summary}</p>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                                <span className="font-medium">
                                    {new Date(vote.vote_date).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Right section - Vote results */}
                    {vote.status !== 'upcoming' ? (
                        <div className="flex flex-col justify-center border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 md:w-96 md:border-t-0 md:border-l md:p-8">
                            <div className="mb-4 flex items-center">
                                <BarChart3 className="mr-2 h-5 w-5 text-[#004494] dark:text-blue-300" />
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Ergebnisse des Bundestags</h4>
                            </div>

                            {/* Compact vote results visualization */}
                            <div className="space-y-4">
                                {/* Vote stats legend */}
                                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs mb-3">
                                    <div className="flex items-center">
                                        <div className="mr-1.5 h-3 w-3 rounded-full bg-green-500"></div>
                                        <span className="font-medium text-green-700 dark:text-green-400">
                                            Ja: {vote.member_vote_stats.total_yes_votes} 
                                            <span className="ml-1 text-gray-500 dark:text-gray-400">
                                                ({vote.member_vote_stats.total_yes_votes_percentage}%)
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="mr-1.5 h-3 w-3 rounded-full bg-red-500"></div>
                                        <span className="font-medium text-red-700 dark:text-red-400">
                                            Nein: {vote.member_vote_stats.total_no_votes} 
                                            <span className="ml-1 text-gray-500 dark:text-gray-400">
                                                ({vote.member_vote_stats.total_no_votes_percentage}%)
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="mr-1.5 h-3 w-3 rounded-full bg-gray-400"></div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            Enthaltung: {vote.member_vote_stats.total_abstention_votes} 
                                            <span className="ml-1 text-gray-500 dark:text-gray-400">
                                                ({vote.member_vote_stats.total_abstention_votes_percentage}%)
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* Single horizontal stacked bar */}
                                <div className="h-4 w-full flex rounded-full overflow-hidden bg-gray-400">
                                    <div 
                                        className="h-full bg-green-600" 
                                        style={{ width: `${vote.member_vote_stats.total_yes_votes_percentage}%` }}
                                        title={`Ja: ${vote.member_vote_stats.total_yes_votes} (${vote.member_vote_stats.total_yes_votes_percentage}%)`}
                                    ></div>
                                    <div 
                                        className="h-full bg-red-500" 
                                        style={{ width: `${vote.member_vote_stats.total_no_votes_percentage}%` }}
                                        title={`Nein: ${vote.member_vote_stats.total_no_votes} (${vote.member_vote_stats.total_no_votes_percentage}%)`}
                                    ></div>
                               </div>

                                {/* Total vote count */}
                                <div className="text-xs text-right text-gray-500 dark:text-gray-400">
                                    Gesamtstimmen: {vote.member_vote_stats.total_votes}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center border-t border-[#FFE082] dark:border-yellow-800 bg-[#FFF8E1] dark:bg-yellow-900/30 p-6 md:w-96 md:border-t-0 md:border-l md:p-8">
                            <div className="mb-4 flex items-center">
                                <Clock className="mr-2 h-5 w-5 text-yellow-700 dark:text-yellow-500" />
                                <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-500">Upcoming Vote</h4>
                            </div>

                            <p className="mb-4 text-sm leading-relaxed text-yellow-700 dark:text-yellow-400">
                                This vote is scheduled for{' '}
                                {new Date(vote.vote_date).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                                . Cast your vote now to compare with official results later.
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    );
}