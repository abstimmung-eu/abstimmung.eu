<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'vote_date',
        'url',
    ];

    protected $primaryKey = 'uuid';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $appends = [
        'status',
        // User Votes
        'total_user_votes',
        'total_user_yes_votes',
        'total_user_yes_votes_percentage',
        'total_user_no_votes',
        'total_user_no_votes_percentage',
        'total_user_abstain_votes',
        'total_user_abstain_votes_percentage',
        // Age Group Statistics
        'age_group_stats',
    ];

    public function memberVoteStats()
    {
        return $this->belongsTo(MemberVoteStats::class);
    }

    public function documents()
    {
        return $this->hasMany(VoteDocument::class);
    }

    public function categories()
    {
        return $this->belongsToMany(VoteCategory::class);
    }

    /**
     * User Votes
     */

    public function userVotes()
    {
        return $this->hasMany(UserVote::class);
    }

    protected function totalUserVotes(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->userVotes()->count(),
        );
    }

    protected function totalUserYesVotes(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->userVotes()->where('vote_position', 'for')->count(),
        );
    }

    protected function totalUserYesVotesPercentage(): Attribute
    {
        $percentage = 0;
        if ($this->totalUserVotes > 0) {
            $percentage = $this->totalUserYesVotes / $this->totalUserVotes * 100;
        }

        return Attribute::make(
            get: fn() => $percentage,
        );
    }

    protected function totalUserNoVotes(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->userVotes()->where('vote_position', 'against')->count(),
        );
    }

    protected function totalUserNoVotesPercentage(): Attribute
    {
        $percentage = 0;
        if ($this->totalUserVotes > 0) {
            $percentage = $this->totalUserNoVotes / $this->totalUserVotes * 100;
        }

        return Attribute::make(
            get: fn() => $percentage,
        );
    }

    protected function totalUserAbstainVotes(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->userVotes()->where('vote_position', 'abstention')->count(),
        );
    }

    protected function totalUserAbstainVotesPercentage(): Attribute
    {
        $percentage = 0;
        if ($this->totalUserVotes > 0) {
            $percentage = $this->totalUserAbstainVotes / $this->totalUserVotes * 100;
        }

        return Attribute::make(
            get: fn() => $percentage,
        );
    }

    /**
     * Member Votes
     */


    /**
     * Returns all member votes.
     */
    public function memberVotes()
    {
        return $this->hasMany(MemberVote::class);
    }

    protected function status(): Attribute
    {
        // Compare vote_date with current date to determine status
        return Attribute::make(
            get: fn() => $this->vote_date > now() ? 'upcoming' : 'completed',
        );
    }

    /**
     * Age Group Statistics
     */
    protected function ageGroupStats(): Attribute
    {
        return Attribute::make(
            get: function () {
                // Define age groups with their labels
                $ageGroups = [
                    '17_and_under' => [0, 17],
                    '18_to_24' => [18, 24],
                    '25_to_34' => [25, 34],
                    '35_to_44' => [35, 44],
                    '45_to_54' => [45, 54],
                    '55_to_64' => [55, 64],
                    '65_plus' => [65, 999],
                ];

                // Build a CASE statement for age grouping
                $caseStatement = 'CASE';
                foreach ($ageGroups as $groupName => [$min, $max]) {
                    $caseStatement .= " WHEN age_at_vote BETWEEN $min AND $max THEN '$groupName'";
                }
                $caseStatement .= ' END AS age_group';

                // Get the base statistics by age group and vote position
                $results = $this->userVotes()
                    ->selectRaw($caseStatement)
                    ->selectRaw('vote_position')
                    ->selectRaw('COUNT(*) as count')
                    ->groupBy('age_group', 'vote_position')
                    ->get();

                // Format the results
                $stats = [];

                // Initialize the stats structure for all age groups
                foreach ($ageGroups as $groupName => $_) {
                    $stats[$groupName] = [
                        'total' => 0,
                        'yes' => [
                            'count' => 0,
                            'percentage' => 0,
                        ],
                        'no' => [
                            'count' => 0,
                            'percentage' => 0,
                        ],
                        'abstain' => [
                            'count' => 0,
                            'percentage' => 0,
                        ],
                    ];
                }

                // Fill in the actual data from results
                foreach ($results as $result) {
                    if (!$result->age_group) continue;

                    $voteMap = [
                        'for' => 'yes',
                        'against' => 'no',
                        'abstention' => 'abstain'
                    ];

                    $voteType = $voteMap[$result->vote_position] ?? null;
                    if (!$voteType) continue;

                    $stats[$result->age_group][$voteType]['count'] = $result->count;
                    $stats[$result->age_group]['total'] += $result->count;
                }

                // Calculate percentages
                foreach ($stats as $groupName => &$groupData) {
                    if ($groupData['total'] > 0) {
                        $groupData['yes']['percentage'] = round(($groupData['yes']['count'] / $groupData['total']) * 100, 2);
                        $groupData['no']['percentage'] = round(($groupData['no']['count'] / $groupData['total']) * 100, 2);
                        $groupData['abstain']['percentage'] = round(($groupData['abstain']['count'] / $groupData['total']) * 100, 2);
                    }
                }

                return $stats;
            },
        );
    }
}
