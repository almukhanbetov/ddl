<?php
namespace App\Http\Controllers;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
class LeadController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('WHATSAPP LEAD HIT', $request->all());
        Lead::create([
            'channel' => 'whatsapp',
            'phone' => $request->phone,
            'total_price' => $request->total_price,
            'cart' => $request->cart,
            'ip' => $request->ip(),
        ]);
        return response()->json(['ok' => true]);
    }
    public function whatsapp(Request $request)
    {
        Log::info('WHATSAPP HIT', $request->all());
        // Приводим cart к массиву
        $cartRaw = $request->input('cart', []);
        $cart = json_decode(json_encode($cartRaw), true);
        if (empty($cart)) {
            return response()->json(['error' => 'Cart empty'], 422);
        }
        $normalizedCart = [];
        // Нормализуем корзину (ТОЛЬКО ДАННЫЕ)
        foreach ($cart as $item) {
            $normalizedCart[] = [
                'product_id' => $item['product']['id'] ?? null,
                'name'       => $item['product']['name'] ?? '',
                'price'      => $item['product']['price'] ?? 0,
                'qty'        => $item['qty'] ?? 1,
            ];
        }
       Lead::create([
            'source'       => 'whatsapp',
            'phone'        => $request->phone,
            'email'        => $request->email,
            'total_price'  => $request->total_price,
            'cart'         => $normalizedCart,
            'ip'           => $request->ip(),
            'user_agent'   => $request->userAgent(),
            'utm'          => session('utm'),
        ]);
        return response()->json(['ok' => true]);
    }
}
