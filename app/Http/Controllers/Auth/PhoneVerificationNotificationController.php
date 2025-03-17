<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\VerificationToken;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PhoneVerificationNotificationController extends Controller
{
    /**
     * Send a new phone verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedPhone()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        // check if the user has already sent a verification code in the last 2 minutes
        $verificationToken = VerificationToken::where('identifier', $request->user()->phone)->latest()->first();
        if ($verificationToken && $verificationToken->created_at->addMinutes(2) > now()) {
            return back()->with('status', 'verification-sms-sent');
        }

        $request->user()->sendPhoneVerificationNotification();

        return back()->with('status', 'verification-sms-sent');
    }
}
