<?php
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VisitController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\Admin\AdminLeadController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\OrderController;
use App\Models\Category;

Route::get('/version', function () {
    return response()->json([
        'app' => config('app.name'),
        'build' => env('APP_BUILD'),
        'time' => now(),
    ]);
});
Route::get("/", [PageController::class, 'index'])->name('pages.index');
Route::get("/pages/shop", [PageController::class, 'shop'])->name('pages.shop');
Route::get("/pages/about", [PageController::class, 'about'])->name('pages.about');
Route::get("/pages/contacts", [PageController::class, 'contacts'])->name('pages.contacts');
Route::post('/lead/whatsapp', [LeadController::class, 'store'])
    ->name('lead.whatsapp');
    Route::post('/cart/clear', function () {
    session()->forget('cart');
    return response()->json(['ok' => true]);
})->name('cart.clear');
Route::get('/thanks', function () {
    return view('pages.thanks');
})->name('thanks');
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('dashboard');
        Route::resource('products', ProductController::class);
        Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class);
        Route::post('/products/{product}/gallery',[ProductController::class, 'uploadGallery'])->name('products.gallery.upload');
        Route::delete('products/{product}/gallery/{index}',[ProductController::class, 'deleteGallery'])->name('products.gallery.delete');
        Route::resource('users', UserController::class);
        Route::get('/visits', [VisitController::class, 'index'])->name('visits.index');
        Route::resource('bookings', BookingController::class);
        // Route::resource('orders', Admin\OrderController::class);
});
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/leads', [AdminLeadController::class, 'index'])->name('admin.leads.index');
    Route::post('/leads/{lead}/status', [AdminLeadController::class, 'updateStatus'])->name('admin.leads.status');
});
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add/{product}', [CartController::class, 'add'])->name('cart.add');
Route::post('/cart/remove/{id}', [CartController::class, 'remove'])->name('cart.remove');
Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');
Route::get('/checkout', [CheckoutController::class,'form'])->name('checkout');
Route::post('/checkout', [CheckoutController::class,'submit'])->name('checkout.submit');
Route::delete('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
Route::get('/order', [OrderController::class, 'create'])->name('order.create');
Route::post('/order', [OrderController::class, 'store'])->name('order.store');
Route::get('/order/success', function () {
    return view('orders.success');
})->name('order.success');
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
