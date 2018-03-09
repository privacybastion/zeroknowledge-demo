@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">

        <div class="col-md-6">
            <div class="panel panel-default">
                <div class="panel-heading">Tokens ({{ $tokens->count() }})</div>
                <div class="panel-body">
                    @foreach ($tokens as $token)
                    <h2>Token #{{ $token->id }}</h2>
                    <dl>
                        <dt>Token</dt>
                        <dd>{{ $token->token }}</dd>
                        <dt>Max Accounts</dt>
                        <dd>{{ $token->accounts_max }}</dd>
                    </dl>
                    @endforeach
                </div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="panel panel-default">
                <div class="panel-heading">Accounts ({{ $accounts->count() }})</div>
                <div class="panel-body">
                    @foreach ($accounts as $account)
                    <h2>Account #{{ $account->id }}</h2>
                    <dl>
                        <dt>Public Key</dt>
                        <dd>
                            <pre style="max-height: 200px; overflow: scroll;">{{ $account->public_key }}</pre>
                        </dd>
                    </dl>
                    @endforeach
                </div>
            </div>
        </div>

    </div>
</div>
@endsection
