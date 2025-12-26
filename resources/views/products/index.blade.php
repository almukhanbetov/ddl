@extends('layouts.app')

@section('content')
<div class="bg-slate-900 min-h-screen text-white">

    <div class="container mx-auto py-10">

        <h1 class="text-2xl font-bold mb-6">Аренда мебели</h1>

        <div class="grid grid-cols-4 gap-6">

            @foreach($products as $p)
            <div class="bg-slate-800 rounded-xl p-4 shadow">

                <img src="{{ $p->image }}" class="rounded mb-3">

                <div class="font-semibold">{{ $p->name }}</div>

                <div class="text-green-400 mt-1">
                    {{ number_format($p->price, 0, ',', ' ') }} тг/шт
                </div>

                @if($p->status === 'available')
                    <div class="text-sm text-green-300 mt-1">В наличии</div>
                @else
                    <div class="text-sm text-red-300 mt-1">Нет в наличии</div>
                @endif

            </div>
            @endforeach

        </div>

    </div>

</div>
@endsection
