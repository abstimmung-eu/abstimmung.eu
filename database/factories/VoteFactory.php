<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vote>
 */
class VoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'summary' => fake()->sentence(),
            'description' => fake()->sentence(),
            'arguments_for' => fake()->sentence(),
            'arguments_against' => fake()->sentence(),
            'url' => fake()->url(),
            'vote_date' => fake()->dateTimeBetween('-1 month', '+1 month'),
            'airflow_vote_id' => fake()->numberBetween(10000, 100000),
        ];
    }
}
