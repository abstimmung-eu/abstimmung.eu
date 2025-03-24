<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class GitController extends Controller
{
    public function index($year = null, $month = null, $day = null)
    {
        $data = [
            'year' => $year,
            'month' => $month,
            'day' => $day,
        ];

        $validator = validator($data, [
            'year' => 'nullable|integer|min:2000|max:2100',
            'month' => ['nullable', 'regex:/^(0?[1-9]|1[0-2])$/', 'numeric'],
            'day' => ['nullable', 'regex:/^(0?[1-9]|[12][0-9]|3[01])$/', 'numeric'],
        ]);

        if ($validator->fails()) {
            abort(404);
        }

        // Get all votes for the year (and month and day if provided)

        $heatmap = [];
        $votes = [];

        $query = Vote::query();

        $year = $data['year'] == null ? now()->format('Y') : $data['year'];

        $query->whereYear('vote_date', $year)->orderBy('vote_date', 'desc');

        // get heatmap for the year
        $heatmap = $query->get()->groupBy(function ($vote) {
            return $vote->vote_date->format('Y-m-d');
        })->map(function ($votes) {
            return count($votes);
        });


        if ($month !== null) $query->whereMonth('vote_date', $month);
        if ($day !== null) $query->whereDay('vote_date', $day);

        $votes = $query->get();

        $votes->load('memberVoteStats');
        $votes->load('categories');

        $votes = $votes->groupBy(function ($vote) {
            return Carbon::parse($vote->vote_date)->format('Y-m-d');
        })->sortKeys();

        return Inertia::render('git/git', [
            'year' => $year,
            'month' => $month,
            'day' => $day,
            'votes' => $votes,
            'heatmap' => $heatmap,
        ]);
    }
}
