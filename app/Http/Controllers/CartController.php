<?php
namespace App\Http\Controllers;
use App\Models\Product;
use Illuminate\Http\Request;
class CartController extends Controller
{
    // Показать корзину
    public function index(Request $request)
    {
        $cart = $request->session()->get('cart', []); // ['product_id' => ['product' => ..., 'qty' => ...]]
        // посчитаем сумму
        $total = 0;
        foreach ($cart as $item) {
            $total += $item['product']->price * $item['qty'];
        }
        return view('cart.index', compact('cart', 'total'));
    }
    // Добавить товар в корзину
    public function add(Request $request, Product $product)
    {      
        $cart = $request->session()->get('cart', []);      
        if (isset($cart[$product->id])) {
            // уже есть – увеличиваем количество
            $cart[$product->id]['qty']++;
        } else {
            // впервые добавляем
            $cart[$product->id] = [
                'product' => $product,
                'qty'     => 1,
            ];
        }
        $request->session()->put('cart', $cart);
        return back()->with('success', 'Товар добавлен в корзину');
    }
    // Обновить количество
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'qty' => ['required', 'integer', 'min:1'],
        ]);
        $cart = $request->session()->get('cart', []);
        if (isset($cart[$product->id])) {
            $cart[$product->id]['qty'] = $request->input('qty');
            $request->session()->put('cart', $cart);
        }
        return back()->with('success', 'Количество обновлено');
    }
    // Удалить товар из корзины
    public function remove(Request $request, Product $product)
    {
        $cart = $request->session()->get('cart', []);
        unset($cart[$product->id]);
        $request->session()->put('cart', $cart);
        return back()->with('success', 'Товар удалён из корзины');
    }
}
