<?php

namespace Database\Factories;

use App\Models\MemberVoteStats;
use App\Models\Vote;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MemberVoteStats>
 */
class MemberVoteStatsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $totalVotes = $this->faker->numberBetween(50, 500);
        $totalYesVotes = $this->faker->numberBetween(10, $totalVotes - 20);
        $totalNoVotes = $this->faker->numberBetween(5, $totalVotes - $totalYesVotes - 5);
        $totalAbstentionVotes = $totalVotes - $totalYesVotes - $totalNoVotes;
        $totalDidNotVote = $this->faker->numberBetween(0, 100);
        
        $totalVotesExcludingAbsent = max(1, $totalVotes); // Avoid division by zero
        $yesPercentage = round(($totalYesVotes / $totalVotesExcludingAbsent) * 100);
        $noPercentage = round(($totalNoVotes / $totalVotesExcludingAbsent) * 100);
        $abstentionPercentage = round(($totalAbstentionVotes / $totalVotesExcludingAbsent) * 100);

        return [
            'vote_uuid' => Vote::factory(),
            'total_votes' => $totalVotes,
            'total_yes_votes' => $totalYesVotes,
            'total_no_votes' => $totalNoVotes,
            'total_did_not_vote' => $totalDidNotVote,
            'total_abstention_votes' => $totalAbstentionVotes,
            'total_yes_votes_percentage' => $yesPercentage,
            'total_no_votes_percentage' => $noPercentage,
            'total_abstention_votes_percentage' => $abstentionPercentage,
        ];
    }
}
