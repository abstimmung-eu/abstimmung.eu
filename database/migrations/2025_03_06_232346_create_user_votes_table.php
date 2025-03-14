<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_votes', function (Blueprint $table) {
            $table->id();
            // Vote
            $table->foreignUuid('vote_uuid')->references('uuid')->on('votes');
            $table->enum('vote_position', ['for', 'against', 'abstention', 'did_not_vote']);
            // Demographics
            $table->enum('age_group', [
                '17_and_under',
                '18_to_24',
                '25_to_34',
                '35_to_44',
                '45_to_54',
                '55_to_64',
                '65_plus'
            ]);
            $table->enum('gender', [
                'male',
                'female',
                'other'
            ]);
            $table->enum('marital_status', [
                'single',
                'married',
                'divorced',
                'widowed',
                'in_partnership',
                'other'
            ]);
            $table->enum('education', [
                'primary',
                'secondary',
                'tertiary',
                'university',
                'vocational',
                'other'
            ]);
            $table->enum('profession', [
                'employed',
                'self_employed',
                'retired',
                'unemployed'
            ]);
            $table->enum('income', [
                'under_1000',
                '1000_to_1999',
                '2000_to_2999',
                '3000_to_3999',
                '4000_to_4999',
                '5000_to_5999',
                '6000_to_6999',
                '7000_to_7999',
                '8000_to_8999',
                '9000_to_9999',
                '10000_and_above'
            ]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_votes');
    }
};
