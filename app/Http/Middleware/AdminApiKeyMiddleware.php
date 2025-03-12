<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminApiKeyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Retrieve the API key from the .env file
        $apiKey = env('ADMIN_API_KEY');

        // Get the Authorization header
        $authorizationHeader = $request->header('Authorization');

        // Check if the Authorization header exists and starts with "Bearer "
        if (!$authorizationHeader || !str_starts_with($authorizationHeader, 'Bearer ')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Extract the token from the Authorization header
        $token = substr($authorizationHeader, 7);

        // Validate the token against the API key
        if ($token !== $apiKey) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
