<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Token;

class SessionController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        return Token::create($request->all(['accounts_max']));
    }

}
