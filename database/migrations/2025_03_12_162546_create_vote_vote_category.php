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
        Schema::create('vote_vote_category', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('vote_uuid')->references('uuid')->on('votes')->onDelete('cascade');
            $table->foreignId('vote_category_id')->references('id')->on('vote_categories')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vote_vote_category');
    }
};
