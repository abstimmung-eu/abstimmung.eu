<?php

namespace App\Services;

use App\Models\VerificationToken;


/**
 * Service for generating and validating verification tokens.
 */
class VerificationService
{
    public function generateToken(string $identifier, int $length = 8, int $expiresInMinutes = 10): string
    {
        $token = bin2hex(openssl_random_pseudo_bytes(16));
        $token = strtoupper(substr($token, 0, $length));

        // Delete any existing tokens for this entity and type
        VerificationToken::where('identifier', $identifier)
            ->delete();

        $verificationToken = VerificationToken::create([
            'identifier' => $identifier,
            'token' => $token,
            'expires_at' => now()->addMinutes($expiresInMinutes),
        ]);

        return $verificationToken->token;
    }

    public function validateToken(string $identifier, string $token): bool
    {
        $token = VerificationToken::where([
            'identifier' => $identifier,
            'token' => $token,
        ])->first();

        if ($token && !$token->isExpired()) {
            return true;
        }

        return false;
    }
}
