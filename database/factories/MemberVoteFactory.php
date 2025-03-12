<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Vote;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MemberVote>
 */
class MemberVoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vote_uuid' => function () {
                return Vote::factory()->create()->uuid;
            },
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'group' => fake()->randomElement(['CDU/CSU', 'SPD', 'GRÜNE', 'FDP', 'LINKE', 'AfD']),
            'vote_position' => fake()->randomElement([
                'for', 'for', 'for',
                'against', 
                'abstention',
                'did_not_vote'
            ]),
        ];
    }
}
