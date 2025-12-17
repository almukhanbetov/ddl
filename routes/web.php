<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get("/", [PageController::class, 'index'])->name('pages.index');
Route::get("/pages/shop", [PageController::class, 'shop'])->name('pages.shop');
Route::get("/pages/about", [PageController::class, 'about'])->name('pages.about');
Route::get("/pages/contacts", [PageController::class, 'contacts'])->name('pages.contacts');
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
