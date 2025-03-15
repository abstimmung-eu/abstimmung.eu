<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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
    ];

    public function memberVoteStats()
    {
        return $this->hasOne(MemberVoteStats::class);
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
}
