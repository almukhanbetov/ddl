@extends('layouts.guest')

@section('title','Доступ запрещён')

@section('content')
<div class="min-h-[70vh] flex items-center justify-center bg-[#0b0f1a] text-gray-200">

    <div class="max-w-xl text-center">

        <div class="text-7xl font-extrabold text-green-400 mb-4">
            403
        </div>

        <h1 class="text-3xl font-bold mb-4">
            У вас нет прав для просмотра этой страницы
        </h1>

        <p class="text-gray-400 mb-8">
            Возможно, вы вошли под обычной учетной записью.<br>
            Если вам нужен доступ — обратитесь к администратору.
        </p>

        <div class="flex gap-3 justify-center">

            <a href="{{ url('/') }}"
               class="px-6 py-3 rounded-xl bg-[#162033] hover:bg-[#1e2940] transition">
                ⬅ На главную
            </a>

            @guest
            <a href="{{ route('login') }}"
               class="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-black transition">
                🔐 Войти
            </a>
            @endguest

        </div>

    </div>

</div>
@endsection
