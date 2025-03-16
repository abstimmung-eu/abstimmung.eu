<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemberVoteStats extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'vote_id',
        'total_votes',
        'total_yes_votes',
        'total_no_votes',
        'total_did_not_vote',
        'total_abstention_votes',
        'total_yes_votes_percentage',
        'total_no_votes_percentage',
        'total_abstention_votes_percentage',
    ];

    /**
     * Get the vote that owns the stats.
     */
    public function vote()
    {
        return $this->belongsTo(Vote::class, 'vote_id', 'id');
    }
}
