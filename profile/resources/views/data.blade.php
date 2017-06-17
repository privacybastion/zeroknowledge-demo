@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">

        <div class="col-md-6">
            <div class="panel panel-default">
                <div class="panel-heading">Subscriptions ({{ $subscriptions->count() }})</div>
                <div class="panel-body">
                    <table class="table-responsive table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Max Accounts</th>
                            <th>Is Default?</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach ($subscriptions as $subscription)
                        <tr>
                            <td>{{ $subscription->id }}</td>
                            <td>{{ $subscription->name }}</td>
                            <td>{{ $subscription->accounts_max }}</td>
                            <td>{{ $subscription->is_default ? "Yes" : "No" }}</td>
                        </tr>
                        @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="panel panel-default">
                <div class="panel-heading">Users ({{ $users->count() }})</div>
                <div class="panel-body">
                    @foreach ($users as $user)
                    <h2>{{ $user->name }} &lt;{{ $user->email }}&gt;</h2>
                    <dl>
                        <dt>Subscription Id</dt>
                        <dd>{{ $user->subscription_id }}</dd>
                        <dt>Profile Data</dt>
                        <dd>
                            <pre style="max-height: 100px; overflow: scroll;">{{ $user->profile_data }}</pre>
                        </dd>
                        <dt>Profile Public Key</dt>
                        <dd>
                            <pre style="max-height: 100px; overflow: scroll;">{{ $user->profile_public_key }}</pre>
                        </dd>
                        <dt>Profile Private Key</dt>
                        <dd>
                            <pre style="max-height: 100px; overflow: scroll;">{{ $user->profile_private_key }}</pre>
                        </dd>
                    </dl>
                    @endforeach
                </div>
            </div>
        </div>

    </div>
</div>
@endsection
