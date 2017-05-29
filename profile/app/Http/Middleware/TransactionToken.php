<?php

namespace App\Http\Middleware;

use Closure;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Auth;

class TransactionToken
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
        if (!session('transaction_token')) {

            $headers = ['Authorization' => 'Bearer ' . env('TRANSACTION_APIKEY')];
            $content = ['accounts_max' => Auth::user()->subscription->accounts_max];
            $endpoint = trim(env('TRANSACTION_HOST'), '/') . '/api/v1/session';

            $client = new Client();
            $res = $client->request('POST', $endpoint, ['headers' => $headers, 'json' => $content]);
            $res = json_decode($res->getBody()->getContents(), true);

            session(['transaction_token' => $res['token']]);
        }

        return $next($request);

    }
}
