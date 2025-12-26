@extends('layouts.admin')

@section('content')

<h1 class="text-2xl font-bold text-white mb-6">
    Панель управления
</h1>

<div class="grid grid-cols-3 gap-4">

    <div class="p-4 bg-slate-800 border border-slate-700 rounded">
        <div class="text-gray-400">Товаров</div>
        <div class="text-2xl font-bold text-green-400">
            {{ $products_count ?? 0 }}
        </div>
    </div>

    <div class="p-4 bg-slate-800 border border-slate-700 rounded">
        <div class="text-gray-400">Бронирований</div>
        <div class="text-2xl font-bold text-blue-400">
            {{ $bookings_count ?? 0 }}
        </div>
    </div>

    <div class="p-4 bg-slate-800 border border-slate-700 rounded">
        <div class="text-gray-400">В аренде сегодня</div>
        <div class="text-2xl font-bold text-yellow-400">
            {{ $active_today ?? 0 }}
        </div>
    </div>

</div>

@endsection
