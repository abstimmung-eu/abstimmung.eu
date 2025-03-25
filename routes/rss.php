<?php

use Illuminate\Support\Facades\Route;

Route::prefix('rss')->group(function(){
    Route::get('', \App\Http\Controllers\Rss\RssController::class)->name('rss.index');
});
