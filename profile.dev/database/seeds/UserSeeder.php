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
            'password' => bcrypt('$2y$10$bep9dechrai.cop9cihgmOrQ9v5bpyUYFT2kKL4aNS9pnyqJyBiWK'),
            'remember_token' => str_random(10),
        ]);
    }
}
