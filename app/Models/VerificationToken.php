<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerificationToken extends Model
{
    protected $fillable = [
        'identifier',
        'token',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function isExpired(): bool
    {
        return $this->expires_at < now();
    }
}
