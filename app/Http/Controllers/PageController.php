<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index(){
        return view("pages.index");
    }

    public function shop(Request $request){
          $query = Product::query();
        // фильтр по наличию
          if ($request->has('available')) {
               $query->where('status', 'available');
          }
          $products = $query->latest()->paginate(12);
          return view("pages.shop", compact('products'));
    }
    public function about(){
         return view("pages.about");
    }
    public function contacts(){
         return view("pages.contacts");
    }
}
