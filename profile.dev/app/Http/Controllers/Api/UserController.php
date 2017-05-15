<?php

namespace App\Http\Controllers\Api;

use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        return response()->json([
            'profile_data' => Auth::user()->profile_data,
            'profile_private_key' => Auth::user()->profile_private_key,
            'profile_public_key' => Auth::user()->profile_public_key,
        ]);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $data = $request->all(['profile_data', 'profile_private_key']);
//        var_export($data['profile_private_key']);
        $user = User::find(Auth::id());

        if (isset($data['profile_data'])) {
            $user->profile_data = $data['profile_data'];
        }

        if (isset($data['profile_private_key'])) {
            $user->profile_private_key = $data['profile_private_key'];
        }

        if (isset($data['profile_public_key'])) {
            $user->profile_public_key = $data['profile_public_key'];
        }

        $user->save();
        Auth::setUser($user);

        return response()->json([
            'profile_data' => Auth::user()->profile_data,
            'profile_private_key' => Auth::user()->profile_private_key,
            'profile_public_key' => Auth::user()->profile_public_key,
        ]);

    }


}