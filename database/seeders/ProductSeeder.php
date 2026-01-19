<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // ⚠️ В DEV можно чистить, в PROD — убрать
        Product::truncate();

        // Получаем категории по slug
        $categories = Category::whereIn('slug', [
            'chairs',
            'tables',
            'tablecloth',
            'napkins',
            'rings',
        ])->get()->keyBy('slug');

        $products = [
            // 🪑 Стулья
            [
                'name' => 'Стул Chiavari белый',
                'slug' => 'chiavari-white',
                'price' => 3500,
                'quantity' => 50,
                'category' => 'chairs',
                'description' => 'Элегантный банкетный стул Chiavari для свадеб и мероприятий.',
                'image' => 'products/chair-chiavari-white.jpg',
            ],
            [
                'name' => 'Стул Chiavari золото',
                'slug' => 'chiavari-gold',
                'price' => 3800,
                'quantity' => 40,
                'category' => 'chairs',
                'description' => 'Золотой стул Chiavari — премиальный стиль.',
                'image' => 'products/chair-chiavari-gold.jpg',
            ],

            // 🪟 Столы
            [
                'name' => 'Круглый стол 180 см',
                'slug' => 'round-table-180',
                'price' => 7000,
                'quantity' => 20,
                'category' => 'tables',
                'description' => 'Круглый стол для банкетов и фуршетов.',
                'image' => 'products/table-round-180.jpg',
            ],
            [
                'name' => 'Прямоугольный стол 180×80',
                'slug' => 'rect-table-180',
                'price' => 6500,
                'quantity' => 15,
                'category' => 'tables',
                'description' => 'Универсальный стол для мероприятий.',
                'image' => 'products/table-rect-180.jpg',
            ],

            // 🧺 Скатерти
            [
                'name' => 'Скатерть белая круглая',
                'slug' => 'tablecloth-white-round',
                'price' => 2500,
                'quantity' => 60,
                'category' => 'tablecloth',
                'description' => 'Классическая белая скатерть для круглых столов.',
                'image' => 'products/tablecloth-white-round.jpg',
            ],
            [
                'name' => 'Скатерть айвори',
                'slug' => 'tablecloth-ivory',
                'price' => 2700,
                'quantity' => 45,
                'category' => 'tablecloth',
                'description' => 'Скатерть цвета айвори — популярный свадебный вариант.',
                'image' => 'products/tablecloth-ivory.jpg',
            ],

            // 🧻 Салфетки
            [
                'name' => 'Салфетки белые (набор)',
                'slug' => 'napkins-white',
                'price' => 500,
                'quantity' => 200,
                'category' => 'napkins',
                'description' => 'Тканевые салфетки для сервировки.',
                'image' => 'products/napkins-white.jpg',
            ],
            [
                'name' => 'Салфетки пудровые',
                'slug' => 'napkins-powder',
                'price' => 600,
                'quantity' => 150,
                'category' => 'napkins',
                'description' => 'Салфетки нежного пудрового цвета.',
                'image' => 'products/napkins-powder.jpg',
            ],

            // 💍 Кольца
            [
                'name' => 'Кольца для салфеток золото',
                'slug' => 'napkin-rings-gold',
                'price' => 800,
                'quantity' => 120,
                'category' => 'rings',
                'description' => 'Золотые кольца для сервировки салфеток.',
                'image' => 'products/napkin-rings-gold.jpg',
            ],
            [
                'name' => 'Кольца для салфеток серебро',
                'slug' => 'napkin-rings-silver',
                'price' => 750,
                'quantity' => 110,
                'category' => 'rings',
                'description' => 'Серебряные кольца — универсальный вариант.',
                'image' => 'products/napkin-rings-silver.jpg',
            ],
        ];

        foreach ($products as $item) {
            Product::create([
                'name'        => $item['name'],
                'slug'        => $item['slug'],
                'price'       => $item['price'],
                'quantity'    => $item['quantity'],
                'description' => $item['description'],
                'image'       => $item['image'],
                'status'      => 'available',
                'category_id' => $categories[$item['category']]->id,
            ]);
        }
    }
}
