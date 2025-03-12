<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DemographicsController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/demographics');
    }
}
