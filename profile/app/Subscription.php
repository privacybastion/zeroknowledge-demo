<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{

    /**
     * Get the users for the subscription.
     */
    public function users()
    {
        return $this->hasMany('App\User');
    }

}
