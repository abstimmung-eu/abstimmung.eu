import { Vote } from '@/types/vote';
import React from 'react';
import { VoteCard } from './vote-card'; // Adjust import path as needed

// Define the props for the component
interface VotesListProps {
    votes: {
        [key: string]: Vote[];
    };
}

const VotesList: React.FC<VotesListProps> = ({ votes }) => {
    return (
        <>
            <div className="grid gap-4">
                {Object.keys(votes).length > 0 ? (
                    Object.keys(votes).map((date: string) => (
                        <React.Fragment key={date}>
                            <div className="my-4 flex items-center gap-4">
                                <h2 className="text-lg font-semibold whitespace-nowrap">
                                    {new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </h2>
                                <hr className="flex-grow border-t border-gray-200" />
                            </div>
                            {votes[date].map((vote: Vote) => (
                                <VoteCard key={vote.id} vote={vote} />
                            ))}
                        </React.Fragment>
                    ))
                ) : (
                    <div className="rounded-lg border border-dashed p-10 text-center">
                        <p className="text-muted-foreground mb-3">Keine Abstimmungen gefunden.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default VotesList;
