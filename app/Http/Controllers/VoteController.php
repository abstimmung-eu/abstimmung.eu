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

        return Inertia::render('vote', [
            'vote' => $vote,
            'user_vote_participation' => $user_vote_participation
        ]);
    }
}
