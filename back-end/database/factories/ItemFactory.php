<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Item;
use Faker\Generator as Faker;
use Illuminate\Support\Str;

$factory->define(Item::class, function (Faker $faker) {
    return [
        'name' => Str::title($faker -> unique()->word),
        'barcode' => $faker -> randomNumber(6),
        'buy_price' => $faker -> randomNumber(4),
        'sell_price' => $faker -> randomNumber(5),

    ];
});
