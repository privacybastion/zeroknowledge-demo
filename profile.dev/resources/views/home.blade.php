@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Dashboard</div>
                <div class="panel-body">

                    <p>
                        You are logged in and are on the <strong>{{ Auth::user()->subscription->name }}</strong> plan.
                        This gives you access to <strong>{{ Auth::user()->subscription->accounts_max }}</strong> accounts.
                    </p>

                    <p>Your token for the transaction server is:</p>
                    <pre>{{ session('transaction_token') }}</pre>

                    <p>Your Profile Data is:</p>
                    <pre>{{ Auth::user()->subscription->profile_data }}</pre>

                    <p>Your Private Key for Public Profile data is:</p>
                    <pre>{{ Auth::user()->subscription->profile_private_key }}</pre>

                </div>
            </div>
        </div>
    </div>
</div>
@endsection
