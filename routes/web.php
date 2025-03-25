<?php

use App\Http\Controllers\GitController;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\UserVoteController;
use App\Http\Controllers\VoteController;
use App\Http\Middleware\MailAndPhoneIsVerified;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [IndexController::class, 'index'])->name('index');

Route::get('/git/{year?}/{month?}/{day?}', [GitController::class, 'index'])->name('git');

Route::get('/votes', [VoteController::class, 'index'])->name('votes');
Route::get('/votes/{vote}', [VoteController::class, 'show'])->name('vote.show');

Route::middleware(['auth', MailAndPhoneIsVerified::class])->group(function () {
    Route::post('/votes/cast', [UserVoteController::class, 'store'])->name('vote.cast');
});

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/impressum', function () {
    return Inertia::render('impressum');
})->name('impressum');

Route::get('/datenschutz', function () {
    return Inertia::render('datenschutz');
})->name('datenschutz');

require __DIR__ . '/comments.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/rss.php';
