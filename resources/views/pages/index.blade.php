@extends('layouts.app')
@section('content')
    <div class="product-section">
        <div class="container">
            <div class="row">
                <div class="col-md-12 col-lg-3 mb-5 mb-lg-0">
                    <h2 class="mb-4 section-title">«Что сейчас в тренде?»</h2>
                    <p class="mb-4">Стулья «Наполеон» — для стильных и изысканных мероприятий.
                        Столы любых форм и размеров — удобство и комфорт для гостей.
                        Фотозоны и арки — создаём незабываемые кадры.
                        Декор и цветочные стойки — детали, которые делают праздник особенным.
                        Все, что нужно для вашего события, в одном месте!</p>
                    <p><a href="shop.html" class="btn">Explore</a></p>
                </div>
                <div class="col-12 col-md-4 col-lg-3 mb-5 mb-md-0">
                    <a class="product-item" href="cart.html">
                        <img src="{{ asset('ddl/images/product-1.png') }}" class="img-fluid product-thumbnail">
                        <h3 class="product-title">Nordic Chair</h3>
                        <strong class="product-price">$50.00</strong>

                        <span class="icon-cross">
                            <img src="{{ asset('ddl/images/cross.svg') }}" class="img-fluid">
                        </span>
                    </a>
                </div>
                <div class="col-12 col-md-4 col-lg-3 mb-5 mb-md-0">
                    <a class="product-item" href="cart.html">
                        <img src="{{ asset('ddl/images/product-2.png') }}" class="img-fluid product-thumbnail">
                        <h3 class="product-title">Kruzo Aero Chair</h3>
                        <strong class="product-price">$78.00</strong>

                        <span class="icon-cross">
                            <img src="{{ asset('ddl/images/cross.svg') }}" class="img-fluid">
                        </span>
                    </a>
                </div>
                <div class="col-12 col-md-4 col-lg-3 mb-5 mb-md-0">
                    <a class="product-item" href="cart.html">
                        <img src="{{ asset('ddl/images/product-3.png') }}" class="img-fluid product-thumbnail">
                        <h3 class="product-title">Ergonomic Chair</h3>
                        <strong class="product-price">$43.00</strong>

                        <span class="icon-cross">
                            <img src="{{ asset('ddl/images/cross.svg') }}" class="img-fluid">
                        </span>
                    </a>
                </div>

            </div>
        </div>
    </div>
    <div class="why-choose-section">
        <div class="container">
            <div class="row justify-content-between">
                <div class="col-lg-6">
                    <h2 class="section-title">Почему выбираете нас</h2>
                    <p>DDL_DECOR — это декор, который создаёт атмосферу.
                        Мы специализируемся на аренде мебели и оформлении мероприятий любого масштаба: от камерных ужинов до
                        масштабных торжеств.
                        Наша цель — подчеркнуть стиль вашего события и сделать его запоминающимся.</p>
                    <div class="row my-5">
                        <div class="col-6 col-md-6">
                            <div class="feature">
                                <div class="icon">
                                    <img src="{{ asset('ddl/images/truck.svg') }}" alt="Image" class="imf-fluid">
                                </div>
                                <h3>Доставка по городу &amp; Бесплатно.</h3>
                                <p>Мы привезём и заберём декор в удобное для вас время без дополнительной оплаты.</p>
                            </div>
                        </div>

                        <div class="col-6 col-md-6">
                            <div class="feature">
                                <div class="icon">
                                    <img src="{{ asset('ddl/images/bag.svg') }}" alt="Image" class="imf-fluid">
                                </div>
                                <h3>Приемлемые цены&Честная стоимость</h3>
                                <p> Честная стоимость и прозрачные условия для каждого клиента.</p>
                            </div>
                        </div>

                        <div class="col-6 col-md-6">
                            <div class="feature">
                                <div class="icon">
                                    <img src="{{ asset('ddl/images/support.svg') }}" alt="Image" class="imf-fluid">
                                </div>
                                <h3>Принимаем заказы круглосуточно — 24/7.</h3>
                                <p>Работаем без выходных: ваши заказы принимаем в удобное для Вас время и выполняем вовремя
                                </p>
                            </div>
                        </div>

                        <div class="col-6 col-md-6">
                            <div class="feature">
                                <div class="icon">
                                    <img src="{{ asset('ddl/images/return.svg') }}" alt="Image" class="imf-fluid">
                                </div>
                                <h3>Гарантируем выполнение в срок</h3>
                                <p>Ваш заказ под контролем, качество и сроки гарантируем!</p>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="col-lg-5">
    <div class="img-wrap video-box">
        <video autoplay muted loop playsinline id="instaVideo">
            <source src="{{ asset('ddl/videos/1.mp4') }}" type="video/mp4">
        </video>

        <button class="sound-btn" onclick="toggleSound(event)">
            🔇
        </button>
    </div>
</div>

            </div>
        </div>
    </div>
    <div class="we-help-section">
        <div class="container">
            <div class="row justify-content-between">
                <div class="col-lg-7 mb-5 mb-lg-0">
                    <div class="imgs-grid">
                        <div class="grid grid-1"><img src="{{ asset('ddl/images/img-grid-1.jpg') }}" alt="Untree.co">
                        </div>
                        <div class="grid grid-2"><img src="{{ asset('ddl/images/img-grid-2.jpg') }}" alt="Untree.co"></div>
                        <div class="grid grid-3"><img src="{{ asset('ddl/images/img-grid-3.jpg') }}" alt="Untree.co"></div>
                    </div>
                </div>
                <div class="col-lg-5 ps-lg-5">
                    <h2 class="section-title mb-4">Помогаем выбрать декорации, идеально гармонирующие с вашим мероприятием.
                    </h2>
                    <p>Создаем праздничное настроение с помощью шаров, цветов, тканей и фотозон. Любой декор под ваши идеи и
                        стиль — красиво, стильно, незабываемо.</p>
                    <ul class="list-unstyled custom-list my-4">
                        <li>Цветы–живые или искусственные, для стильных и нежных кадров.🌸</li>
                        <li>Баннеры–креативные фоны любых форм под ваш праздник.🎨</li>
                        <li>Ткань на каркасе – уют и элегантность в каждом фото.✨</li>
                        <li>Шары – ярко, весело и фотогенично.🎈</li>
                    </ul>
                    <p><a herf="#" class="btn">Explore</a></p>
                </div>
            </div>
        </div>
    </div>
    <div class="blog-section">
        <div class="container">
            <div class="row mb-5">
                <div class="col-md-6">
                    <h2 class="section-title">Отзыв от клиентов</h2>
                </div>
                <div class="col-md-6 text-start text-md-end">
                    <a href="#" class="more">View All Posts</a>
                </div>
            </div>

            <div class="row">

                <div class="col-12 col-sm-6 col-md-4 mb-4 mb-md-0">
                    <div class="post-entry">
                        <div class="video-otzv mb-4">
                            <video controls playsinline>
                                <source src="{{ asset('ddl/videos/otzv1.mp4') }}" type="video/mp4">
                            </video>
                        </div>
                        <div class="post-content-entry">
                            <h3><a href="#">Арман Смагулов</a></h3>
                            <div class="meta">
                                <span><a href="#"></a></span> <span>в <a href="#">
                                        20.03.2025</a></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-4 mb-4 mb-md-0">
                    <div class="post-entry">
                        <div class="video-otzv mb-4">
                            <video controls playsinline>
                                <source src="{{ asset('ddl/videos/otzv2.mp4') }}" type="video/mp4">
                            </video>
                        </div>
                        <div class="post-content-entry">
                            <h3><a href="#">Роза Стамкулова</a></h3>
                            <div class="meta">
                                <span> <a href="#"></a></span> <span>в <a href="#">15.07
                                        2025</a></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-4 mb-4 mb-md-0">
                    <div class="post-entry">
                        <div class="video-otzv mb-4">
                            <video controls playsinline>
                                <source src="{{ asset('ddl/videos/otzv3.mp4') }}" type="video/mp4">
                            </video>
                        </div>
                        <div class="post-content-entry">
                            <h3><a href="#">Арай Аханова</a></h3>
                            <div class="meta">
                                <span> <a href="#"></a></span> <span>в <a href="#">3.08
                                        2025</a></span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div> 
@endsection
