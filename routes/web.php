<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VisitController;

Route::get("/", [PageController::class, 'index'])->name('pages.index');
Route::get("/pages/shop", [PageController::class, 'shop'])->name('pages.shop');
Route::get("/pages/about", [PageController::class, 'about'])->name('pages.about');
Route::get("/pages/contacts", [PageController::class, 'contacts'])->name('pages.contacts');


Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('dashboard');
        Route::resource('products', ProductController::class);
        Route::post('/products/{product}/gallery',[ProductController::class, 'uploadGallery'])->name('products.gallery.upload');
        Route::delete('products/{product}/gallery/{index}',[ProductController::class, 'deleteGallery'])->name('products.gallery.delete');
        Route::resource('users', UserController::class);
        Route::get('/visits', [VisitController::class, 'index'])->name('visits.index');
        Route::resource('bookings', BookingController::class);
        // Route::resource('orders', Admin\OrderController::class);
});
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
