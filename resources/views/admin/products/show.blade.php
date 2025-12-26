@extends('layouts.admin')

@section('title','Товар '.$product->name)

@section('content')

<h1 class="text-2xl text-white font-semibold mb-6">
    {{ $product->name }}
</h1>

<div class="bg-slate-900 border border-slate-700 p-6 rounded-xl max-w-3xl">

    <img src="{{ asset('storage/'.$product->image) }}"
         class="rounded-lg mb-4 w-64">

    <div class="text-gray-300 mb-2">
        Цена: <b>{{ $product->price }} ₸</b>
    </div>

    <div class="text-gray-300 mb-2">
        Количество: <b>{{ $product->quantity }}</b>
    </div>

    <div class="text-gray-300 mb-2">
        Статус: <b>{{ $product->status }}</b>
    </div>

    <p class="text-gray-400 mt-4">
        {{ $product->description }}
    </p>

</div>

@endsection
