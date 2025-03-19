import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Vote } from '@/types/vote';
import { Link } from '@inertiajs/react';
import { BarChart3, Clock } from 'lucide-react';

interface VoteCardProps {
    vote: Vote;
}

export function VoteCard({ vote }: VoteCardProps) {
    return (
        <Link href={`/votes/${vote.id}`} className="group block focus:outline-none">
            <Card className="overflow-hidden rounded-sm border-1 bg-white py-0 transition-all duration-200 hover:shadow-md dark:bg-gray-800">
                <div className="flex flex-col md:flex-row">
                    {/* Left section - Main vote info */}
                    <div className="flex-1 p-4 md:p-8">
                        <h3
                            className="mb-2 text-xl font-semibold break-words hyphens-auto text-[#004494] transition-colors duration-200 group-hover:text-[#003472] md:text-2xl dark:text-blue-300 dark:group-hover:text-blue-200"
                            lang="de"
                        >
                            {vote.title}
                        </h3>

                        <div className="my-2 hidden flex-wrap items-center gap-2 overflow-x-auto md:flex">
                            {vote.categories.map((category) => (
                                <Badge variant="outline" className="rounded-full text-sm" key={category.id}>
                                    {category.name}
                                </Badge>
                            ))}
                        </div>

                        <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 md:text-base dark:text-gray-300">{vote.summary}</p>
                    </div>

                    {/* Right section - Vote results */}
                    {vote.status !== 'upcoming' ? (
                        <div className="flex flex-col justify-center border-t border-gray-100 bg-gray-50 p-4 md:w-96 md:border-t-0 md:border-l md:p-8 dark:border-gray-700 dark:bg-gray-900">
                            <div className="mb-4 flex items-center">
                                <BarChart3 className="mr-2 h-5 w-5 text-[#004494] dark:text-blue-300" />
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Ergebnisse des Bundestags</h4>
                            </div>

                            {/* Compact vote results visualization */}
                            <div className="space-y-4">
                                {/* Vote stats legend */}
                                <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2 text-xs">
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
                                <div className="flex h-4 w-full overflow-hidden rounded-full bg-gray-400">
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

                                {/* Total vote count and date */}
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <div>
                                        {new Date(vote.vote_date).toLocaleDateString('de-DE', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </div>
                                    <div>Gesamtstimmen: {vote.member_vote_stats.total_votes}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center border-t border-[#FFE082] bg-[#FFF8E1] p-6 md:w-96 md:border-t-0 md:border-l md:p-8 dark:border-yellow-800 dark:bg-yellow-900/30">
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
