<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vote;
use App\Models\MemberVote;
use App\Models\MemberVoteStats;
use App\Models\VoteCategory;
use App\Models\VoteDocument;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class VoteImportController extends Controller
{
    /**
     * Import votes from the request
     */
    public function import(Request $request)
    {
        // Validate the incoming request
        $validator = $this->validateImportRequest($request);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $results = [];
        $votesData = $request->input('votes');

        DB::beginTransaction();
        try {
            foreach ($votesData as $voteData) {
                // Create vote and related data
                $vote = $this->createVote($voteData);

                // Add to results
                $results[] = [
                    'id' => $vote->uuid,
                    'title' => $vote->title,
                    'member_votes_count' => count($voteData['member_votes'])
                ];
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => count($results) . ' vote(s) imported successfully',
                'data' => $results
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Vote import failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to import votes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validate the import request
     */
    private function validateImportRequest(Request $request)
    {
        return Validator::make($request->all(), [
            'votes' => 'required|array',
            'votes.*.title' => 'required|string|max:255',
            'votes.*.summary' => 'nullable|string',
            'votes.*.description' => 'required|string',
            'votes.*.vote_date' => 'required|date',
            'votes.*.url' => 'nullable|string',
            'votes.*.arguments_for' => 'nullable|string',
            'votes.*.arguments_against' => 'nullable|string',
            'votes.*.member_votes' => 'required|array',
            'votes.*.member_votes.*.first_name' => 'required|string',
            'votes.*.member_votes.*.last_name' => 'required|string',
            'votes.*.member_votes.*.group' => 'required|string',
            'votes.*.member_votes.*.vote_position' => 'required|string|in:for,against,abstention,did_not_vote',
            'votes.*.member_votes.*.url' => 'nullable|string',
            'votes.*.documents' => 'nullable|array',
            'votes.*.documents.*.title' => 'required|string',
            'votes.*.documents.*.filename' => 'required|string',
            'votes.*.documents.*.url' => 'required|string',
            'votes.*.categories' => 'nullable|array',
            'votes.*.categories.*' => 'required|string',
        ]);
    }

    /**
     * Create a vote and its related records
     */
    private function createVote(array $voteData): Vote
    {        // Create the vote record
        $vote = new Vote();
        $vote->uuid = (string) Str::uuid();
        $vote->title = $voteData['title'];
        $vote->description = $voteData['description'];
        $vote->url = $voteData['url'];
        $vote->vote_date = $voteData['vote_date'];

        if (!empty($voteData['summary'])) {
            $vote->summary = $voteData['summary'];
        }

        if (!empty($voteData['arguments_for'])) {
            $vote->arguments_for = $voteData['arguments_for'];
        }

        if (!empty($voteData['arguments_against'])) {
            $vote->arguments_against = $voteData['arguments_against'];
        }

        $vote->save();

        // Create vote stats record
        $memberVoteStats = new MemberVoteStats();
        $memberVoteStats->vote_uuid = $vote->uuid;
        $memberVoteStats->save();

        // Create member votes
        $this->createMemberVotes($vote, $voteData['member_votes'], $memberVoteStats);

        // Update percentages after all votes are processed
        $this->updateVotePercentages($memberVoteStats);

        // Create documents if any
        if (!empty($voteData['documents'])) {
            $this->createVoteDocuments($vote, $voteData['documents']);
        }

        // Create categories if any
        if (!empty($voteData['categories'])) {
            $this->createVoteCategories($vote, $voteData['categories']);
        }

        return $vote;
    }

    /**
     * Create vote categories for a vote
     */
    private function createVoteCategories(Vote $vote, array $categoriesData): void
    {
        foreach ($categoriesData as $categoryName) {
            $category = VoteCategory::firstOrCreate(['name' => $categoryName]);
            $vote->categories()->attach($category);
        }
    }

    /**
     * Create member votes for a vote
     */
    private function createMemberVotes(Vote $vote, array $memberVotesData, MemberVoteStats $stats): void
    {
        foreach ($memberVotesData as $memberVoteData) {
            // Update vote statistics
            $this->updateVoteStats($stats, $memberVoteData['vote_position']);

            // Create member vote record
            $memberVote = new MemberVote();
            $memberVote->vote_uuid = $vote->uuid;
            $memberVote->first_name = $memberVoteData['first_name'];
            $memberVote->last_name = $memberVoteData['last_name'];
            $memberVote->group = $memberVoteData['group'];
            $memberVote->vote_position = $memberVoteData['vote_position'];

            if (!empty($memberVoteData['url'])) {
                $memberVote->url = $memberVoteData['url'];
            }

            $memberVote->save();
        }
    }

    /**
     * Update vote statistics based on vote position
     */
    private function updateVoteStats(MemberVoteStats $stats, string $votePosition): void
    {
        switch ($votePosition) {
            case 'for':
                $stats->total_yes_votes++;
                $stats->total_votes++;
                break;
            case 'against':
                $stats->total_no_votes++;
                $stats->total_votes++;
                break;
            case 'abstention':
                $stats->total_abstention_votes++;
                $stats->total_votes++;
                break;
            case 'did_not_vote':
                $stats->total_did_not_vote++;
                break;
        }

        $stats->save();
    }

    /**
     * Update vote percentages
     */
    private function updateVotePercentages(MemberVoteStats $stats): void
    {
        if ($stats->total_votes > 0) {
            $stats->total_yes_votes_percentage = round(($stats->total_yes_votes / $stats->total_votes) * 100);
            $stats->total_no_votes_percentage = round(($stats->total_no_votes / $stats->total_votes) * 100);
            // Calculate the third percentage to ensure sum is 100%
            $stats->total_abstention_votes_percentage = 100 - $stats->total_yes_votes_percentage - $stats->total_no_votes_percentage;
        }

        $stats->save();
    }

    /**
     * Create document records for a vote
     */
    private function createVoteDocuments(Vote $vote, array $documentsData): void
    {
        foreach ($documentsData as $documentData) {
            $document = new VoteDocument();
            $document->vote_uuid = $vote->uuid;
            $document->title = $documentData['title'];
            $document->filename = $documentData['filename'];
            $document->url = $documentData['url'];
            $document->save();
        }
    }

    /**
     * Update vote statistics for a given vote
     */
    public function updateMemberVoteStats(Vote $vote): void
    {
        // Get the stats record
        $stats = MemberVoteStats::findOrFail($vote->member_vote_stats_id);

        // Reset counters
        $stats->total_yes_votes = 0;
        $stats->total_no_votes = 0;
        $stats->total_abstention_votes = 0;
        $stats->total_did_not_vote = 0;
        $stats->total_votes = 0;

        // Get all member votes for this vote
        $memberVotes = MemberVote::where('vote_uuid', $vote->uuid)->get();

        // Update stats based on member votes
        foreach ($memberVotes as $memberVote) {
            $this->updateVoteStats($stats, $memberVote->vote_position);
        }

        // Update percentages
        $this->updateVotePercentages($stats);
    }
}
