<!-- Start Header/Navigation -->
<nav class="custom-navbar navbar navbar navbar-expand-md navbar-dark bg-dark" arial-label="Furni navigation bar">

    <div class="container">
        <a class="navbar-brand" href="#">DDL_DECOR<span>.</span></a>

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
                <li><a class="nav-link" href="#"><img src="{{ asset('ddl/images/user.svg') }}"></a></li>
                <li><a class="nav-link" href="cart.html"><img src="{{ asset('ddl/images/cart.svg') }}"></a></li>
            </ul>
        </div>
    </div>

</nav>
<!-- End Header/Navigation -->
