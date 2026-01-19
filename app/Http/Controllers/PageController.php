<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index(){
        return view("pages.index");
    }
    public function shop(Request $request){
          $categorySlug = $request->query('category');
          $currentCategory = null;
          $query = Product::with('category')
               ->where('status', 'available');

          if ($categorySlug) {
               $currentCategory = Category::where('slug', $categorySlug)->firstOrFail();
               $query->where('category_id', $currentCategory->id);
          }

          return view('pages.shop', [
               'products' => $query->get(),
               'currentCategory' => $currentCategory,
          ]);
    }
    public function about(){
         return view("pages.about");
    }
    public function contacts(){
         return view("pages.contacts");
    }
}
