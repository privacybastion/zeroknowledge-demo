<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Token;

class SessionController extends Controller
{

    public function store(Request $request)
    {
        return Token::create($request->all(['accounts_max']));
    }

}
