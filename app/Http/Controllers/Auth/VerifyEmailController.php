<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\VerificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function verify(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('profile.edit', absolute: false))->with('status', 'email-verified');
        }

        $request->validate([
            'token' => 'required|string|size:8',
        ]);

        if (!(new VerificationService())->validateToken($request->user()->email, $request->token)) {
            return redirect()->intended(route('profile.edit', absolute: false))->with('status', 'email-verification-failed');
        }

        $request->user()->markEmailAsVerified();

        return redirect()->intended(route('profile.edit', absolute: false))->with('status', 'email-verified');
    }
}
