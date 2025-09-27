<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Car;
use App\Models\Dealer;


class DatabaseSeeder extends Seeder
{
    public function run()
    {
        Dealer::factory(10)->create()->each(function ($dealer) {
            $dealer->cars()->saveMany(Car::factory(rand(1, 5))->make());
        });
    }
}
