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
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('summary')->nullable();
            $table->text('description');
            $table->text('arguments_for')->nullable();
            $table->text('arguments_against')->nullable();
            $table->string('url')->nullable();
            $table->date('vote_date');
            // $table->foreignId('member_vote_stats_id')->references('id')->on('member_vote_stats');
            $table->timestamps();
            $table->index('vote_date');
            $table->integer('airflow_vote_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};
