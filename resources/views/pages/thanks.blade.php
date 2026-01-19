@extends('layouts.guest')

@section('content')
    <div class="container py-5 text-center">
        <h1 class="mb-3">Спасибо! 🙌</h1>
        <p>Мы получили ваш запрос и свяжемся с вами в WhatsApp.</p>

        <a href="{{ route('pages.index') }}" class="btn btn-dark mt-3">
            Вернуться на главную
        </a>
    </div>
@endsection
