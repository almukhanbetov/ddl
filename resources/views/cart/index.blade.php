@extends('layouts.guest')

@section('title', 'Корзина')

@section('content')
<div class="untree_co-section before-footer-section">
    <div class="container">

        <div class="row mb-5">
            <div class="col-md-12">
                <div class="site-blocks-table">
                    <table class="table">
                        <thead>
                        <tr>
                            <th>Изображение</th>
                            <th>Продукт</th>
                            <th>Цена</th>
                            <th class="text-center">Количество</th>
                            <th class="text-right">Сумма</th>
                            <th>Удалить</th>
                        </tr>
                        </thead>

                        <tbody>
                        @forelse($cart as $id => $item)
                            <tr class="cart-row" data-id="{{ $id }}">
                                {{-- IMAGE --}}
                                <td>
                                    <img src="{{ asset('storage/'.$item['product']->image) }}"
                                         class="img-fluid" style="width:60px">
                                </td>

                                {{-- NAME --}}
                                <td>
                                    <h2 class="h5 text-black">
                                        {{ $item['product']->name }}
                                    </h2>
                                </td>

                                {{-- PRICE --}}
                                <td class="price" data-price="{{ $item['product']->price }}">
                                    {{ number_format($item['product']->price,0,'.',' ') }} ₸
                                </td>

                                {{-- QTY --}}
                                <td class="text-center">
                                    <div class="input-group justify-content-center" style="max-width:140px;margin:auto">
                                        <div class="input-group-prepend">
                                            <button class="qty-btn btn btn-outline-black"
                                                    data-id="{{ $id }}" data-dir="-">−</button>
                                        </div>

                                        <input type="text"
                                               class="form-control text-center qty-input"
                                               value="{{ $item['qty'] }}"
                                               data-id="{{ $id }}"
                                               readonly>

                                        <div class="input-group-append">
                                            <button class="qty-btn btn btn-outline-black"
                                                    data-id="{{ $id }}" data-dir="+">+</button>
                                        </div>
                                    </div>
                                </td>

                                {{-- ROW TOTAL --}}
                                <td class="text-right row-total" data-id="{{ $id }}">
                                    {{ number_format($item['product']->price * $item['qty'],0,'.',' ') }} ₸
                                </td>

                                {{-- REMOVE --}}
                                <td>
                                    <form method="POST" action="{{ route('cart.remove',$id) }}">
                                        @csrf
                                        @method('DELETE')
                                        <button class="btn btn-black btn-sm">X</button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="text-center">
                                    Корзина пуста 🙂
                                </td>
                            </tr>
                        @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {{-- TOTAL --}}
        <div class="row">
            <div class="col-md-6"></div>

            <div class="col-md-6 pl-5">
                <div class="row justify-content-end">
                    <div class="col-md-8">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <span class="text-black">Итого</span>
                            </div>
                            <div class="col-md-6 text-right">
                                <strong id="grand-total" class="text-black">
                                    {{ number_format($total,0,'.',' ') }} ₸
                                </strong>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-12">
                                <a href="{{ route('order.create') }}"
                                   class="btn btn-black btn-lg py-3 btn-block">
                                    Оформить заказ
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    </div>
</div>

{{-- ================= JS ================= --}}
<script>
document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', function () {

        let id   = this.dataset.id
        let dir  = this.dataset.dir

        let row      = document.querySelector(`.cart-row[data-id="${id}"]`)
        let qtyInput = row.querySelector('.qty-input')
        let price    = parseInt(row.querySelector('.price').dataset.price)
        let rowTotal = row.querySelector('.row-total')

        let qty = parseInt(qtyInput.value)

        if (dir === '+') qty++
        if (dir === '-' && qty > 1) qty--

        qtyInput.value = qty
        rowTotal.innerText = (price * qty).toLocaleString('ru') + ' ₸'

        // update grand total
        let grand = 0
        document.querySelectorAll('.row-total').forEach(el => {
            grand += parseInt(el.innerText.replace(/\D/g,''))
        })
        document.getElementById('grand-total').innerText =
            grand.toLocaleString('ru') + ' ₸'

        // ajax
        fetch(`/cart/update/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify({ qty })
        })
    })
})
</script>
@endsection
