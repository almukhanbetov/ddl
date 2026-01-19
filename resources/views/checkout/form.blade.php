@extends('layouts.guest')
@section('content')
    <div class="untree_co-section">
        <div class="container">
            <div class="block">
                <div class="row justify-content-center">
                    <div class="col-md-8 col-lg-8 pb-4">
                        <div class="row mb-5">
                            <div class="col-lg-4">
                                <div class="service no-shadow align-items-center link horizontal d-flex active"
                                    data-aos="fade-left" data-aos-delay="0">
                                    <div class="service-icon color-1 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                            <path
                                                d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                        </svg>
                                    </div>
                                    <div class="service-contents">
                                        <p>г.Алматы, Абая, 39</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-4">
                                <div class="service no-shadow align-items-center link horizontal d-flex active"
                                    data-aos="fade-left" data-aos-delay="0">
                                    <div class="service-icon color-1 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            fill="currentColor" class="bi bi-envelope-fill" viewBox="0 0 16 16">
                                            <path
                                                d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
                                        </svg>
                                    </div>
                                    <div class="service-contents">
                                        <p>info@ddl.du</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-4">
                                <div class="service no-shadow align-items-center link horizontal d-flex active"
                                    data-aos="fade-left" data-aos-delay="0">
                                    <div class="service-icon color-1 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            fill="currentColor" class="bi bi-telephone-fill" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd"
                                                d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                                        </svg>
                                    </div>
                                    <div class="service-contents">
                                        <p>+7 707 869 9831</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <form method="POST" action="{{ route('checkout.submit') }}">
                            @csrf
                            <div class="row">
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="text-black" for="name">Имя</label>
                                        <input type="text" class="form-control" id="name" name="name"
                                            value="{{ old('name') }}" required>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="text-black" for="phone">Телефон</label>
                                        <input type="text" class="form-control" id="phone" name="phone"
                                            value="{{ old('phone') }}" required>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="text-black" for="email">E-mail</label>
                                <input type="email" class="form-control" id="email" name="email"
                                    value="{{ old('email') }}">
                            </div>

                            <div class="form-group mb-5">
                                <label class="text-black" for="message">Сообщения</label>
                                <textarea name="message" class="form-control" id="message" cols="30" rows="5">{{ old('message') }}</textarea>
                            </div>

                            {{-- <button type="submit" class="btn btn-primary-hover-outline"> Подтвердить заказ</button> --}}
                            <!-- WhatsApp -->
                            <a id="whatsappBtn" href="https://wa.me/77077801011" target="_blank"
                                class="btn btn-success w-100 mt-3">
                                Написать на WhatsApp
                            </a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const phoneInput = document.getElementById('phone');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const whatsappBtn = document.getElementById('whatsappBtn');
            window.CART_DATA = @json(session('cart', []));
            if (!phoneInput || !whatsappBtn) return;
            // ===== Маска телефона =====
            function formatPhone(value) {
                let digits = value.replace(/\D/g, '');
                if (digits.startsWith('7')) digits = digits.slice(1);
                let p = '+7 ';
                if (digits.length > 0) p += '(' + digits.substring(0, 3);
                if (digits.length >= 4) p += ') ' + digits.substring(3, 6);
                if (digits.length >= 7) p += '-' + digits.substring(6, 8);
                if (digits.length >= 9) p += '-' + digits.substring(8, 10);
                return p;
            }
            phoneInput.addEventListener('input', e => {
                e.target.value = formatPhone(e.target.value);
            });
            // ===== WhatsApp сообщение =====
            function buildWhatsAppMessage(cart) {
                let msg = 'Здравствуйте! Хочу оформить заказ:%0A%0A';
                let total = 0;

                Object.values(cart).forEach(item => {
                    msg += `• ${item.product.name} × ${item.qty}%0A`;
                    total += item.qty * item.product.price;
                });

                msg += `%0AИтого: ${total} ₸`;
                return msg;
            }
            // ===== КЛИК ПО WhatsApp =====
            whatsappBtn.addEventListener('click', async (e) => {
                e.preventDefault();

                const cart = window.CART_DATA;
                if (!cart || Object.keys(cart).length === 0) {
                    alert('Корзина пуста');
                    return;
                }

                let total = 0;
                Object.values(cart).forEach(i => total += i.qty * i.product.price);

                // 👉 запись лида
                console.log('CLICK WHATSAPP');
                console.log('CART:', window.CART_DATA);
                await fetch('{{ route('lead.whatsapp') }}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: JSON.stringify({
                        phone: document.getElementById('phone')?.value || null,
                        email: document.getElementById('email')?.value || null,
                        total_price: total,
                        cart: cart
                    })
                });
                await fetch("{{ route('cart.clear') }}", {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    }
                });

                const sellerPhone = '77078699831'; // WhatsApp компании
                const message = buildWhatsAppMessage(cart);

                window.open(
                    `https://wa.me/${sellerPhone}?text=${message}`,
                    '_blank'
                );
                setTimeout(() => {
                    window.location.href = "{{ route('thanks') }}";
                }, 1000);
            });
        });
    </script>
@endsection
