<?php
namespace App\Http\Controllers;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
class CheckoutController extends Controller
{
    public function form()
    {
        $cart = session('cart', []);
        if (empty($cart)) {
            return redirect()->route('cart.index');
        }
         $total = collect($cart)->sum(fn($item) =>
            $item['product']->price * $item['qty']
        );
       
        return view('checkout.form', compact('cart','total'));
    }
    public function submit(Request $request)
    {
        $cart = session('cart', []);
    
        if(!$cart) return back();
        $data = $request->validate([
            'name' => 'required',
            'phone' => 'required',
            'address' => 'required'
        ]);
        $order = Order::create([
            'user_id' => auth()->id(),
            'name' => $data['name'],
            'phone' => $data['phone'],
            'address' => $data['address'],
            'total_price' => collect($cart)->sum(fn($i)=>$i['price']*$i['qty']),
        ]);

        foreach($cart as $productId => $item){
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $productId,
                'quantity' => $item['qty'],
                'price' => $item['price'],
            ]);
        }

        session()->forget('cart');

        return redirect()->route('pages.index')
            ->with('success','Ваш заказ принят 👍');
    }
}

