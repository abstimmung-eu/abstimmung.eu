<?php

namespace App\Http\Controllers;

use App\Models\UserVote;
use App\Models\UserVoteParticipation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserVoteController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) return redirect()->back()->with('error', 'Sie müssen sich anmelden, um abzustimmen.');

        $request->validate([
            'vote_uuid' => 'required|exists:votes,uuid',
            'vote_position' => 'required|in:for,against,abstention',
        ]);

        $vote_uuid = $request->vote_uuid;
        $vote_position = $request->vote_position;

        // Check if user has already participated in this vote
        $existingParticipation = UserVoteParticipation::where('vote_uuid', $vote_uuid)
            ->where('user_id', $user->id)
            ->exists();

        if ($existingParticipation) {
            return redirect()->back()->with('error', 'Sie haben bereits an dieser Abstimmung teilgenommen.');
        }

        // Store anonymous user vote
        UserVote::create([
            'vote_uuid' => $vote_uuid,
            'vote_position' => $vote_position,
            'age_at_vote' => $user->age,
        ]);

        // Store user vote participation
        UserVoteParticipation::create([
            'vote_uuid' => $vote_uuid,
            'user_id' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Ihre Stimme wurde erfolgreich abgegeben.');
    }
}
