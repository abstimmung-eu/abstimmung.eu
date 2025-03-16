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
            'vote_id' => Vote::factory(),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'group' => fake()->randomElement(['CDU/CSU', 'SPD', 'GRÜNE', 'FDP', 'LINKE', 'AfD']),
            'state' => fake()->randomElement(['Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen', 'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen']),
            'vote_position' => fake()->randomElement([
                'for',
                'for',
                'for',
                'against',
                'abstention',
                'did_not_vote'
            ]),
        ];
    }
}
