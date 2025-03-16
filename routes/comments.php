<?php

use App\Http\Controllers\VoteCommentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/votes/{vote}/comments', [VoteCommentController::class, 'store'])->name('comments.store');
    Route::delete('/comments/{comment}', [VoteCommentController::class, 'destroy'])->name('comments.destroy');
});
