<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            // Основная информация
            $table->string('name');
            $table->string('slug')->unique();
            $table->integer('price'); // цена продажи / аренды
             // Наличие
            $table->integer('quantity')->default(0);
            $table->text('description')->nullable();            
            $table->string('image'); // главное фото
            $table->json('gallery')->nullable(); // несколько фото
            // Статус товара
            $table->enum('status', ['available', 'unavailable', 'archived'])
                ->default('available');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
