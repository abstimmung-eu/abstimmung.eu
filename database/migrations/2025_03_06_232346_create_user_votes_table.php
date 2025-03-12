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
            $table->foreignId('vote_id')->references('id')->on('votes');
            $table->enum('vote_position', ['for', 'against', 'abstention', 'did_not_vote']);
            // Demographics
            $table->string('age_group');
            $table->string('gender');
            $table->string('marital_status');
            $table->string('education');
            $table->string('current_activity');
            $table->string('household_size');
            $table->string('federal_state');
            $table->string('income');
            $table->string('political_affiliation');
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
