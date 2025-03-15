<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Traits\MustVerifyPhone as MustVerifyPhoneTrait;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
use App\Contracts\MustVerifyPhone as MustVerifyPhoneContract;

class User extends Authenticatable implements MustVerifyEmailContract, MustVerifyPhoneContract
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, MustVerifyPhoneTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'phone',
        'birthyear',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the votes a user has participated in.
     */
    public function voteParticipations()
    {
        return $this->hasMany(UserVoteParticipation::class);
    }

    /**
     * Get the age of the user at the current date.
     */
    public function getAgeAttribute()
    {
        return $this->birthyear ? date('Y') - $this->birthyear : null;
    }
}
