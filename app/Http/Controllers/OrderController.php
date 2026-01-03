<?php
namespace App\Http\Controllers;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
class OrderController extends Controller
{
    public function create()
    {
         $cart = session('cart', []);
        if (empty($cart)) {
            return redirect()->route('cart.index')
                ->with('error', 'Корзина пуста. Добавьте товары 🙂');
        }
        $total = collect($cart)->sum(fn($i) => $i['price'] * $i['qty']);
        return view('orders.create', compact('cart','total'));
    }
    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required',
            'customer_phone' => 'required',
        ]);
        $cart = session('cart', []);
        if (empty($cart)) {
            return redirect()->route('cart.index')
                ->with('error', 'Корзина пуста');
        }
        $total = collect($cart)->sum(fn($i) => $i['price'] * $i['qty']);
        $order = Order::create([
            'user_id' => auth()->id(),
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'total_price' => $total,
        ]);
        foreach ($cart as $id => $item) {
            OrderItem::create([
                'order_id'  => $order->id,
                'product_id'=> $id,
                'price'     => $item['price'],
                'qty'       => $item['qty'],
            ]);
        }

        session()->forget('cart');

        return redirect()->route('order.success');
    }
}
