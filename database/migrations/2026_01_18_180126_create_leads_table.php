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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('source')->default('whatsapp');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->integer('total_price')->nullable();
            $table->json('cart')->nullable();

            $table->json('utm')->nullable();        // 👈 добавить
            $table->string('ip')->nullable();
            $table->string('user_agent')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
