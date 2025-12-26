@extends('layouts.guest')
@section('title', 'Войти')
@section('content')
    <div class="untree_co-section">
        <div class="container">
            <div class="block">
                <div class="row justify-content-center">
                    <div class="col-md-8 col-lg-8 pb-4">
                        <div class="row mb-5">
                            <x-auth-session-status class="mb-4" :status="session('status')" />
                            <form method="POST" action="{{ route('login') }}">
                                @csrf
                                <div class="row">
                                    <div class="col-8">
                                        <div class="form-group">
                                            <label class="text-black" for="email">E-mail</label>
                                            <input type="email" class="form-control" id="email" name="email" value="{{old('email')}}"placeholder="E-mail">
                                            <x-input-error :messages="$errors->get('email')" class="mt-2" />
                                        </div>
                                    </div>
                                    <div class="col-8">
                                        <div class="form-group">
                                            <label class="text-black" for="password">Пароль</label>
                                            <input type="password" class="form-control" id="password" name="password" 
                                                value="{{ old('password') }}" placeholder="Пароль">
                                            <x-input-error :messages="$errors->get('password')" class="mt-2" />
                                        </div>
                                    </div>
                                    <div class="col-8">
                                        <div class="form-group">
                                            <label for="remember_me" class="inline-flex items-center">
                                                <input id="remember_me" type="checkbox"
                                                    class="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
                                                    name="remember">
                                                <span
                                                    class="ms-2 text-sm text-gray-600 dark:text-gray-400">{{ __('Запомни меня') }}</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-8 mb-5 row">
                                        <div class="form-group col-4">
                                            @if (Route::has('password.request'))
                                                <a class="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                                    href="{{ route('password.request') }}">
                                                    {{ __('Забыли пароль?') }}
                                                </a>
                                            @endif
                                        </div>
                                        <div class="form-group col-8">
                                            <a class="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                                href="{{ route('register') }}">
                                                {{ __('Если не зарегистрированы? Зарегистрируйтесь') }}
                                            </a>
                                        </div>
                                    </div>
                                    <button type="submit"
                                        class="btn btn-primary-hover-outline col-8">{{ __('Войти') }}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    @endsection
