<?php

namespace App\Providers;

use App\Models\Category;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class CategoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Прокидываем категории в меню (во все layout'ы)
        View::composer(['layouts.*', 'includes.*'], function ($view) {
            $view->with('menuCategories', Category::orderBy('name')->get());
        });
    }
}
