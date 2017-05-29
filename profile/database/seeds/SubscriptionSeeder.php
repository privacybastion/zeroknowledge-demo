<?php

use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Subscription::create([
            'name' => 'Free',
            'accounts_max' => 10,
            'is_default' => true,
        ]);
    }
}
