@extends('layouts.guest')
@section('content')
    <div class="untree_co-section product-section before-footer-section">
        <div class="container">
            <div class="row">
                @forelse ($products as $product)
                    <div class="col-12 col-md-4 col-lg-3 mb-5">

                        <form action="{{ route('cart.add', $product) }}" method="POST">
                            @csrf

                            <button type="submit" class="product-item" style="border:0;background:none;padding:0;">
                                <img src="{{ asset('storage/' . $product->image) }}" class="img-fluid product-thumbnail">

                                <h3 class="product-title">{{ $product->category?->name ?? 'Без категории' }}</h3>

                                <strong class="product-price">{{ $product->price }}</strong>

                                <span class="icon-cross">
                                    <img src="{{ asset('ddl/images/cross.svg') }}" class="img-fluid">
                                </span>
                            </button>

                        </form>

                    </div>
                @empty
                    <div class="col-12 col-md-4 col-lg-3 mb-5">
                        Нет продуктов пока
                    </div>
                @endforelse

            </div>

        </div>
    </div>
@endsection
