<?php

namespace Database\Seeders;

use App\Models\MemberVoteStats;
use App\Models\Vote;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MemberVoteStatsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if votes exist, if not create them
        if (Vote::count() === 0) {
            $this->command->info('No votes found. Creating votes first...');
            $this->command->call('db:seed', ['--class' => 'VoteSeeder']);
        }

        $votes = Vote::all();
        $this->command->info('Creating vote stats for ' . $votes->count() . ' votes...');

        foreach ($votes as $vote) {
            // Use the factory to create stats for each vote
            MemberVoteStats::factory()->create([
                'vote_uuid' => $vote->uuid
            ]);
        }

        $this->command->info('Member vote stats created successfully.');
    }
}
