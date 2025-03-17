<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\VerificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VerifyPhoneController extends Controller
{
    /**
     * Mark the authenticated user's phone number as verified.
     */
    public function verify(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedPhone()) {
            return redirect()->intended(route('profile.edit', absolute: false))->with('status', 'phone-verified');
        }

        $request->validate([
            'token' => 'required|string|size:8',
        ]);

        if (!(new VerificationService())->validateToken($request->user()->phone, $request->token)) {
            return redirect()->intended(route('profile.edit', absolute: false))->with('status', 'phone-verification-failed');
        }

        $request->user()->markPhoneAsVerified();

        return redirect()->intended(route('profile.edit', absolute: false))->with('status', 'phone-verified');
    }
}
