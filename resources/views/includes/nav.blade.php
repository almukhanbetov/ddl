<!-- Start Header/Navigation -->
<nav class="custom-navbar navbar navbar navbar-expand-md navbar-dark bg-dark" arial-label="Furni navigation bar">
    <div class="container">
        <a class="navbar-brand" href="#"><img src="{{ asset('ddl/images/logo.png') }}" class="img-fluid"></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsFurni"
            aria-controls="navbarsFurni" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarsFurni">
            <ul class="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
                <li class="nav-item {{ Route::is('pages.index') ? 'active' : '' }}">
                    <a class="nav-link" href="{{ route('pages.index') }}">Главная</a>
                </li>

                <li class="nav-item {{ Route::is('pages.shop') ? 'active' : '' }}">
                    <a class="nav-link" href="{{ route('pages.shop') }}">Магазин</a>
                </li>

                <li class="nav-item {{ Route::is('pages.about') ? 'active' : '' }}">
                    <a class="nav-link" href="{{ route('pages.about') }}">О нас</a>
                </li>

                <li class="nav-item {{ Route::is('pages.contacts') ? 'active' : '' }}">
                    <a class="nav-link" href="{{ route('pages.contacts') }}">Контакты</a>
                </li>

            </ul>
            <ul class="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5">
                <li><a class="nav-link" href="{{ route('register') }}"><img
                            src="{{ asset('ddl/images/user.svg') }}"></a></li>
                <li><a class="nav-link" href="cart.html"><img src="{{ asset('ddl/images/cart.svg') }}"></a></li>
            </ul>
            <ul class="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5">
                {{-- Если гость --}}
                {{-- @guest
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('login') }}">
                            <img src="{{ asset('ddl/images/user.svg') }}" />
                            Войти
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('register') }}">
                            Регистрация
                        </a>
                    </li>
                @endguest --}}
                {{-- Если авторизован --}}
                @auth
                    <li class="nav-item d-flex align-items-center text-white me-2">
                        <a href="{{ route('admin.dashboard') }}" class="text-white no-underline">{{ auth()->user()->name }}</a>
                    </li>

                    <li class="nav-item">
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button class="btn btn-sm btn-outline-warning">
                                Выйти
                            </button>
                        </form>
                    </li>
                @endauth
                {{-- корзина — показываем всегда --}}
                {{-- <li class="nav-item">
                    <a class="nav-link" href="cart.html">
                        <img src="{{ asset('ddl/images/cart.svg') }}" />
                    </a>
                </li> --}}
            </ul>

        </div>

    </div>

</nav>
<!-- End Header/Navigation -->
