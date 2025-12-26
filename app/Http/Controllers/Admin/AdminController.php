<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class AdminController extends Controller
{
    public function index()
    {
        $products_count = Product::count();
        $bookings_count = Booking::count();
        $active_today = Booking::when(
            Schema::hasColumn('bookings', 'rent_date'),
            fn($q) => $q->whereDate('rent_date', today())
        )->count();

        return view('admin.index', compact(
            'products_count',
            'bookings_count',
            'active_today'
        ));
    }
}
