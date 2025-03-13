<?php

use App\Http\Controllers\IndexController;
use App\Http\Controllers\UserVoteController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [IndexController::class, 'index'])->name('index');

Route::get('/votes', [VoteController::class, 'index'])->name('votes');
Route::get('/votes/{vote}', [VoteController::class, 'show'])->name('vote');
Route::post('/votes/cast', [UserVoteController::class, 'store'])->name('vote.cast');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/home', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
