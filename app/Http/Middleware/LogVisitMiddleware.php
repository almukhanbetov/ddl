<?php

namespace App\Http\Middleware;

use App\Models\Visit;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogVisitMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        Visit::create([
            'user_id'    => auth()->id(),
            'ip'         => $request->ip(),
            'user_agent' => substr($request->userAgent(), 0, 250),
            'url'        => $request->fullUrl(),
        ]);

        return $next($request);
        return $next($request);
    }
}
