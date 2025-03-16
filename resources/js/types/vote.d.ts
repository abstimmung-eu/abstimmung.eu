export type VoteStatus = 'upcoming' | 'completed';
export type VoteCategory = 'Environment' | 'Digital Economy' | 'Agriculture' | 'Business & Economy' | 'Civil Liberties' | 'Industry' | string;
export type VoteFilter = 'all' | 'recent' | 'upcoming' | 'passed' | 'rejected';

export interface VoteResults {
    yes: number;
    no: number;
    abstain: number;
}

export interface UserVoteResults extends VoteResults {
    total: number;
}

export interface Vote {
    id: number;
    title: string;
    summary: string;
    description: string;
    vote_date: string;
    status: VoteStatus;
    url: string;
    category?: VoteCategory;
    // Member Votes
    total_member_votes: number;
    total_member_yes_votes: number;
    total_member_yes_votes_percentage: number;
    total_member_no_votes: number;
    total_member_no_votes_percentage: number;
    total_member_abstain_votes: number;
    total_member_abstain_votes_percentage: number;
    total_member_did_not_vote_votes: number;
    total_member_did_not_vote_votes_percentage: number;
    // User Votes
    total_user_votes: number;
    total_user_yes_votes: number;
    total_user_yes_votes_percentage: number;
    total_user_no_votes: number;
    total_user_no_votes_percentage: number;
    total_user_abstain_votes: number;
    total_user_abstain_votes_percentage: number;

    member_votes: MemberVote[];
    user_votes: UserVote[];
    documents: VoteDocument[];
    member_vote_stats: MemberVoteStats;
    categories: {
        id: number | string;
        name: string;
    }[];
    comments: VoteComment[];
}

export interface VoteComment {
    id: number;
    vote_id: number;
    parent_id: number | null;
    comment: string;
    created_at: string;
    updated_at: string;
    commentator: {
        id: number;
        username: string;
    };
}

export interface MemberVoteStats {
    total_votes: number;
    total_yes_votes: number;
    total_yes_votes_percentage: number;
    total_no_votes: number;
    total_no_votes_percentage: number;
    total_abstention_votes: number;
    total_abstention_votes_percentage: number;
    total_did_not_vote: number;
}

export interface MemberVote {
    id: number;
    vote_id: number;
    first_name: string;
    last_name: string;
    vote_position: string;
    group: string;
    state: string;
    url: string;
    created_at: string;
    updated_at: string;
}

export interface UserVote {
    id: number;
    vote_id: number;
    vote_position: string;
    created_at: string;
    updated_at: string;
}

export interface VoteDocument {
    id: number;
    vote_id: number;
    title: string;
    filename: string;
    url: string;
}
