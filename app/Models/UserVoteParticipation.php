<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserVoteParticipation extends Model
{
    protected $fillable = [
        'vote_id',
        'user_id',
    ];
}
