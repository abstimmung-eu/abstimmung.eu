<?php

namespace Database\Seeders;

use App\Models\MemberVote;
use App\Models\Vote;
use Illuminate\Database\Seeder;

class MemberVoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all votes from the database
        $votes = Vote::all();

        // For each vote, create 100 member votes
        foreach ($votes as $vote) {
            MemberVote::factory()
                ->count(30)
                ->create([
                    'vote_uuid' => $vote->uuid,
                ]);
        }
    }
}
