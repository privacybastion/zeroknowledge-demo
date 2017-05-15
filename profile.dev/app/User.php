<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'profile_data', 'profile_private_key', 'subscription_id'
    ];

    /**
     * Get the subscription for this user.
     */
    public function subscription()
    {
        return $this->belongsTo('App\Subscription');
    }

    /**
     * Override save() to ensure users have a subscription and profile data
     *
     * @param array $options
     * @return bool
     */
    public function save(array $options = [])
    {
        if (!$this->profile_data) $this->profile_data = '';
        if (!$this->profile_private_key) $this->profile_private_key = '';
        if (!$this->profile_public_key) $this->profile_public_key = '';
        if (!$this->subscription_id) $this->subscription_id = Subscription::where('is_default', true)->first()->id;
        parent::save($options);
    }
}
