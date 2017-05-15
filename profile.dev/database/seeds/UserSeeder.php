<?php

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\User::create([
            'name' => 'Ben Dechrai',
            'email' => 'ben@dechrai.com',
            'password' => bcrypt('password'),
            'remember_token' => str_random(10),
        ]);
    }
}
