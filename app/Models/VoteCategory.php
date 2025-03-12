<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VoteCategory extends Model
{
    protected $fillable = ['name'];

    public function votes()
    {
        return $this->belongsToMany(Vote::class);
    }
}
