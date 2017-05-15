<?php

namespace App\Http\Middleware;

use Closure;

class BearerToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($request->hasHeader('Authorization')) {
            list($authScheme, $authValue) = explode(' ', $request->header('Authorization'), 2);
            if ($authScheme == 'Bearer' && $authValue == 'secret_token') {
                return $next($request);
            }
        }
        throw new \Exception("NOT FOR YOUR EYES, NSA");
    }
}
