@extends('layouts.app') {{-- или твой основной layout --}}

@section('content')

<h1 class="text-xl font-semibold mb-4">Оформление заказа</h1>

<form method="POST" action="{{ route('checkout.submit') }}" class="space-y-3">
 @csrf

 <input name="name" class="w-full p-2 rounded bg-slate-800" placeholder="Ваше имя">

 <input name="phone" class="w-full p-2 rounded bg-slate-800" placeholder="Телефон">

 <textarea name="address" class="w-full p-2 rounded bg-slate-800" placeholder="Адрес доставки"></textarea>

 <button class="px-4 py-2 bg-green-600 rounded">
    Подтвердить заказ
 </button>
</form>

@endsection
