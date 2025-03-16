<?php

use App\Http\Controllers\IndexController;
use App\Http\Controllers\UserVoteController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [IndexController::class, 'index'])->name('index');

Route::get('/votes', [VoteController::class, 'index'])->name('votes');
Route::get('/votes/{vote}', [VoteController::class, 'show'])->name('vote.show');
Route::post('/votes/cast', [UserVoteController::class, 'store'])->name('vote.cast');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

require __DIR__ . '/comments.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
