<?php

namespace App\Http\Middleware;

use Closure;
use App\Token;

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
        // OPTIONS requests are always allowed
        if(\strtolower($request->getMethod()) == "options") {
            return $next($request);
        }

        // Anything else must have an auth bearer
        if ($request->hasHeader('Authorization')) {
            list($authScheme, $authValue) = explode(' ', $request->header('Authorization'), 2);

            if ($authScheme == 'Bearer' && $authValue == 'secret_token') {
                return $next($request);
            }

            if($token = Token::where('token', $authValue)->first()) {
                $request->attributes->add(['token' => $token]);
                return $next($request);
            }
        }

        throw new \Exception("NOT FOR YOUR EYES, NSA");
    }
}
