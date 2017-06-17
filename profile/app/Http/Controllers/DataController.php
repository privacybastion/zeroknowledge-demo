<?php

namespace App\Http\Controllers;

use App\Subscription;
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
            'subscriptions' => Subscription::all(),
        ];
        return view('data', $data);
    }
}
