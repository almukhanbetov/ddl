@extends('layouts.guest')
@section('content')
    <div class="untree_co-section product-section before-footer-section">
        <div class="container">
            <div class="row">
                @forelse ($products as $product)
                    <div class="col-12 col-md-4 col-lg-3 mb-5">
                        <a class="product-item" href="#">
                            <img src="{{ asset('storage/'.$product->image) }}" class="img-fluid product-thumbnail">
                            <h3 class="product-title">{{$product->name}}</h3>
                            <strong class="product-price">{{$product->price}}</strong>
                            <span class="icon-cross">
                                <img src="{{ asset('ddl/images/cross.svg') }}" class="img-fluid">
                            </span>
                        </a>
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
