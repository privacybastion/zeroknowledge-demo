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
                        This gives you access to <strong>{{ Auth::user()->subscription->accounts_max }}</strong>
                        accounts.
                    </p>

                    <p>Your token for the transaction server is:</p>
                    <pre>{{ session('transaction_token') }}</pre>

                </div>
            </div>

            <div class="panel panel-default" id="accounts-panel">
                <div class="panel-heading">Accounts</div>
                <div class="panel-body"></div>
            </div>

        </div>
    </div>
</div>
@endsection
