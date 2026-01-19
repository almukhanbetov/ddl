<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SaveUtmMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $utm = collect([
            'utm_source',
            'utm_medium',
            'utm_campaign',
            'utm_content',
            'utm_term',
        ])->filter(fn ($k) => $request->has($k))
          ->mapWithKeys(fn ($k) => [$k => $request->get($k)])
          ->toArray();

        if ($utm) {
            session(['utm' => $utm]);
        }

        return $next($request);
    }
}
