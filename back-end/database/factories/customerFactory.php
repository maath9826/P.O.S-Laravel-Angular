<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Customer;
use Faker\Generator as Faker;
use Illuminate\Support\Str;

$factory->define(Customer::class, function (Faker $faker) {
    return [

            'name' => Str::title($faker -> unique()->word),
            'phone' => $faker -> randomNumber(9),
            'credit' => $faker -> randomNumber(4),


    ];
});
