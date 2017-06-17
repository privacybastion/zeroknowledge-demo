<?php

namespace App\Http\Controllers;

use App\Account;
use App\Token;
use App\User;
use Illuminate\Http\Request;

class DataController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = [
            'users'=> User::all(),
            'accounts' => Account::all(),
            'tokens' => Token::all(),
        ];
        return view('data', $data);
    }
}
