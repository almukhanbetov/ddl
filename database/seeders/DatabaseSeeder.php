<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CategorySeeder::class, // 1️⃣ сначала категории
            ProductSeeder::class,  // 2️⃣ потом продукты
        ]);
    }
}
