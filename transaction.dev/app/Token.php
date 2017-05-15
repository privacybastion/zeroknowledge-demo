<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    protected $fillable = ['accounts_max'];

    public function save(array $options = [])
    {
        if (!$this->token) {
            $this->token = str_random("80");
        }
        parent::save($options);
    }
}
