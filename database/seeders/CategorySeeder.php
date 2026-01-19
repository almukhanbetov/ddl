<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::truncate(); // 🔥 ВАЖНО

        $categories = [
            'Стулья'     => 'chairs',
            'Столы'      => 'tables',
            'Скатерти'   => 'tablecloth',
            'Салфетки'   => 'napkins',
            'Кольца'     => 'rings',
        ];

        foreach ($categories as $name => $slug) {
            Category::create([
                'name' => $name,
                'slug' => $slug,
            ]);
        }
    }
}
