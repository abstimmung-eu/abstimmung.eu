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
        Schema::create('vote_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vote_id')->references('id')->on('votes')->onUpdate('cascade')->onDelete('cascade');
            $table->string('title');
            $table->string('filename');
            $table->string('url');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vote_documents');
    }
};
