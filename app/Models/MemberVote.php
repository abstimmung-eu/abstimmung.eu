<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemberVote extends Model
{
    use HasFactory;

    /**
     * Get the vote that the member vote belongs to.
     */
    public function vote()
    {
        return $this->belongsTo(Vote::class);
    }
}
