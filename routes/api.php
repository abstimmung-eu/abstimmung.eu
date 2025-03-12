<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\VoteImportController;
use App\Http\Middleware\AdminApiKeyMiddleware;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Vote Import endpoint
Route::post('/votes/import', [VoteImportController::class, 'import'])
    ->middleware(AdminApiKeyMiddleware::class)
    ->name('api.votes.import');
