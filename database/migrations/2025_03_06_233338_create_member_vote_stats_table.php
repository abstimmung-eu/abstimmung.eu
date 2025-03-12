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
        Schema::create('member_vote_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vote_id')->references('id')->on('votes');
            $table->integer('total_votes')->default(0);
            $table->integer('total_yes_votes')->default(0);
            $table->integer('total_no_votes')->default(0);
            $table->integer('total_did_not_vote')->default(0);
            $table->integer('total_abstention_votes')->default(0);
            $table->integer('total_yes_votes_percentage')->default(0); // total_yes_votes / total_votes (does not include did not vote)
            $table->integer('total_no_votes_percentage')->default(0); // total_no_votes / total_votes (does not include did not vote)
            $table->integer('total_abstention_votes_percentage')->default(0); // total_abstention_votes / total_votes (does not include did not vote)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_vote_stats');
    }
};
