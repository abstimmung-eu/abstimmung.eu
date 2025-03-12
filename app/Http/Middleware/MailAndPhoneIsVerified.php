<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class MailAndPhoneIsVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() ||
            ! $request->user()->hasVerifiedEmail() ||
            ! $request->user()->hasVerifiedPhone()) {
            return $request->expectsJson()
                ? abort(403, 'Ihre E-Mail-Adresse und Ihr Telefon sind nicht verifiziert.')
                : Redirect::guest(URL::route('verification.notice'));
        }

        return $next($request);
    }
}
