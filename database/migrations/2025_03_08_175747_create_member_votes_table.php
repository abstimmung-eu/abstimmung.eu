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
        Schema::create('member_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vote_id')->references('id')->on('votes');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('group');
            $table->enum('vote_position', ['for', 'against', 'abstention', 'did_not_vote']);
            $table->string('url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_votes');
    }
};
