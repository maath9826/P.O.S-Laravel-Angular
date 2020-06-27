<?php

use Illuminate\Database\Seeder;
use App\Customer;

class customerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(Customer::class,40)->create();
    }
}
