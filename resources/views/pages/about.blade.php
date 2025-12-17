@extends('layouts.guest')
@section('content')
    <!-- Start Why Choose Us Section -->
    <div class="why-choose-section">
        <div class="container">
            <div class="row justify-content-between align-items-center">
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
                    <div class="img-wrap">
                        <img src="{{ asset('ddl/images/why-choose-us-img.jpg') }}" alt="Image" class="img-fluid">
                    </div>
                </div>

            </div>
        </div>
    </div>
    
@endsection
