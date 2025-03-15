<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Pagination\CustomPaginator;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VoteController extends Controller
{
    public function index()
    {
        $search = request()->input('search');
        $category = request()->input('category');
        $categories = [];

        if ($category) {
            $categories = array_map('trim', explode(',', $category));
        }

        $query = Vote::query();

        if ($search) {
            $query->where('title', 'like', '%' . $search . '%');
        }

        if (!empty($categories)) {
            $query->whereHas('categories', function ($query) use ($categories) {
                $query->whereIn('name', $categories);
            });
        }

        $votes = $query->orderBy('vote_date', 'desc')->paginate(30);
        $votes->load('memberVoteStats');
        $votes->load('categories');

        $customPaginator = new CustomPaginator(
            $votes->items(),
            $votes->total(),
            $votes->perPage(),
            $votes->currentPage(),
            [
                'path' => request()->url(),
                'query' => request()->query(),
            ]
        );

        return Inertia::render('votes', [
            'votes' => $customPaginator,
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }

    public function show(Vote $vote)
    {
        $user = Auth::user();
        $user_vote_participation = null;

        if ($user) {
            $user_vote_participation = $user->voteParticipations->where('vote_uuid', $vote->uuid)->first();
        }

        $vote->load('memberVotes');
        $vote->load('userVotes');
        $vote->load('documents');
        $vote->load('memberVoteStats');
        $vote->load('categories');

        $member_votes_by_group = $this->getMemberVotesByGroup($vote);
        $user_votes_by_age_group = $this->getUserVotesByAgeGroup($vote);

        return Inertia::render('vote/vote', [
            'vote' => $vote,
            'user_vote_participation' => $user_vote_participation,
            'member_votes_by_group' => $member_votes_by_group,
            'user_votes_by_age_group' => $user_votes_by_age_group
        ]);
    }

    private function getMemberVotesByGroup(Vote $vote)
    {
        return $vote->memberVotes
            ->groupBy('group')
            ->map(function ($groupVotes) {
                $forCount = $groupVotes->where('vote_position', 'for')->count();
                $againstCount = $groupVotes->where('vote_position', 'against')->count();
                $abstentionCount = $groupVotes->where('vote_position', 'abstention')->count();
                $total = $forCount + $againstCount + $abstentionCount;

                return [
                    'total' => $total,
                    'for' => $forCount,
                    'against' => $againstCount,
                    'abstention' => $abstentionCount,
                    'for_percentage' => $total > 0 ? round(($forCount / $total) * 100, 1) : 0,
                    'against_percentage' => $total > 0 ? round(($againstCount / $total) * 100, 1) : 0,
                    'abstention_percentage' => $total > 0 ? round(($abstentionCount / $total) * 100, 1) : 0,
                ];
            });
    }

    private function getUserVotesByAgeGroup(Vote $vote)
    {
        $userVotesByAgeGroup = $vote->userVotes
            ->groupBy('age_group')
            ->map(function ($groupVotes) {
                $forCount = $groupVotes->where('vote_position', 'for')->count();
                $againstCount = $groupVotes->where('vote_position', 'against')->count();
                $abstentionCount = $groupVotes->where('vote_position', 'abstention')->count();
                $total = $forCount + $againstCount + $abstentionCount;

                return [
                    'total' => $total,
                    'for' => $forCount,
                    'against' => $againstCount,
                    'abstention' => $abstentionCount,
                    'for_percentage' => $total > 0 ? round(($forCount / $total) * 100, 1) : 0,
                    'against_percentage' => $total > 0 ? round(($againstCount / $total) * 100, 1) : 0,
                    'abstention_percentage' => $total > 0 ? round(($abstentionCount / $total) * 100, 1) : 0,
                ];
            });

        return $userVotesByAgeGroup->sortKeys();
    }
}
