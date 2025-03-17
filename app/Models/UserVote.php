<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserVote extends Model
{
    protected $fillable = [
          'vote_id',
          'vote_position',
          'age_group',
          'gender',
          'marital_status',
          'education',
          'current_activity',
          'household_size',
          'federal_state',
          'income',
          'political_affiliation'
    ];
}
