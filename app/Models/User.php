<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Traits\MustVerifyPhone as MustVerifyPhoneTrait;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
use App\Contracts\Auth\MustVerifyPhone as MustVerifyPhoneContract;
use App\Notifications\VerifyEmailNotification;
use App\Services\VerificationService;
use BeyondCode\Comments\Contracts\Commentator;

class User extends Authenticatable implements
    MustVerifyEmailContract,
    MustVerifyPhoneContract,
    Commentator
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, MustVerifyPhoneTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
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
     * Generate and send a new OTP for email verification.
     */
    public function sendEmailVerificationNotification()
    {
        $verificationService = new VerificationService();
        $token = $verificationService->generateToken($this->email);
        $this->notify(new VerifyEmailNotification($token));
    }

    /**
     * Get the votes a user has participated in.
     */
    public function voteParticipations()
    {
        return $this->hasMany(UserVoteParticipation::class);
    }

    /**
     * Check if a comment for a specific model needs to be approved.
     * @param mixed $model
     * @return bool
     */
    public function needsCommentApproval($model): bool
    {
        return false;
    }

    /**
     * Get the contact's phone number (for SMS77 library)
     */
    public function getPhoneNumberAttribute(): string
    {
        return $this->phone;
    }

    public function isVerified(): bool
    {
        return $this->hasVerifiedPhone() && $this->hasVerifiedEmail();
    }
}
