<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Ichtrojan\Otp\Otp;
use Illuminate\Auth\Events\Verified;
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
            'token' => 'required|string|numeric|digits:8',
        ]);

        $status = (new Otp)->validate($request->user()->email, $request->token);

        if ($status === false) {
            return redirect()->intended(route('profile.edit', absolute: false))->with('status', 'email-verification-failed');
        }

        if ($request->user()->markEmailAsVerified()) {
            /** @var \Illuminate\Contracts\Auth\MustVerifyEmail $user */
            $user = $request->user();

            event(new Verified($user));
        }

        return redirect()->intended(route('profile.edit', absolute: false))->with('status', 'email-verified');
    }
}
