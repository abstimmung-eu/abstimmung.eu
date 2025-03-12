<?php

namespace App\Traits;

use Illuminate\Support\Carbon;

trait MustVerifyPhone
{
    public function hasVerifiedPhone(): bool
    {
        return !is_null($this->phone_verified_at);
    }

    public function getPhoneForVerification(): string
    {
        return $this->phone;
    }

    public function markPhoneAsVerified(): bool
    {
        return $this->forceFill([
            'phone_verified_at' => Carbon::now(),
        ])->save();
    }

    public function sendPhoneVerificationNotification(): void
    {
        // Send a notification or SMS
    }
}
