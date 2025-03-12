<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index()
    {

        // Latest 3 votes
        $votes = Vote::latest()
            ->with('memberVotes')
            ->withCount('memberVotes')
            ->limit(3)
            ->get();

        $votes->load('memberVoteStats');
        $votes->load('categories');

        return Inertia::render('index', [
            'votes' => $votes
        ]);
    }

}
