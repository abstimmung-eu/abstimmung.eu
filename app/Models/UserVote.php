<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserVote extends Model
{
    protected $fillable = [
        'vote_uuid',
        'user_id',
        'vote_position',
        'age_group',
    ];
}
