@extends('layouts.admin')
@section('title', 'Редактировать товар')
@section('content')
    <h1 class="text-2xl text-gray-200 mb-6">
        Редактировать товар — {{ $product->name }}
    </h1>
    {{-- 🔄 Форма обновления товара --}}
    <form method="POST" action="{{ route('admin.products.update', $product) }}" enctype="multipart/form-data"
        class="space-y-4">
        @csrf
        @method('PUT')
        {{-- Название --}}
        <input name="name" class="w-full bg-slate-800 border p-2 rounded" placeholder="Название"
            value="{{ old('name', $product->name) }}">
        {{-- Цена --}}
        <select name="category_id" class="w-full bg-slate-800 border p-2 rounded">
            @foreach ($categories as $category)
                <option value="{{ $category->id }}" @selected(old('category_id', $product->category_id ?? null) == $category->id)>
                    {{ $category->name }}
                </option>
            @endforeach
        </select>
        <input name="price" type="number" class="w-full bg-slate-800 border p-2 rounded" placeholder="Цена"
            value="{{ old('price', $product->price) }}">
        {{-- Количество --}}
        <input name="quantity" type="number" class="w-full bg-slate-800 border p-2 rounded" placeholder="Количество"
            value="{{ old('quantity', $product->quantity) }}">
        {{-- Статус --}}
        <select name="status" class="w-full bg-slate-800 border p-2 rounded">
            <option value="available" {{ $product->status == 'available' ? 'selected' : '' }}>
                В наличии
            </option>
            <option value="unavailable" {{ $product->status == 'unavailable' ? 'selected' : '' }}>
                Нет в наличии
            </option>
            <option value="archived" {{ $product->status == 'archived' ? 'selected' : '' }}>
                Архив
            </option>
        </select>
        {{-- Описание --}}
        <textarea name="description" class="w-full bg-slate-800 border p-2 rounded" placeholder="Описание" rows="4">{{ old('description', $product->description) }}</textarea>


        {{-- Главное фото --}}
        <label class="text-gray-300 block mt-4">Главное фото</label>

        @if ($product->image)
            <img src="{{ asset('storage/' . $product->image) }}"
                class="h-32 rounded mb-3 border border-slate-700 object-cover">
        @endif

        <input type="file" name="image" class="text-gray-300">

        {{-- КНОПКА СОХРАНЕНИЯ --}}
        <button class="px-4 py-2 bg-green-600 rounded">
            Сохранить
        </button>

    </form>



    <hr class="my-8 border-slate-700">

    {{-- 🖼 ГАЛЕРЕЯ ТОВАРА --}}
    <h2 class="text-xl text-gray-200 mb-4">Галерея товара</h2>



    {{-- 🔼 Форма добавления фото --}}
    <form method="POST" action="{{ route('admin.products.gallery.upload', $product) }}" enctype="multipart/form-data"
        class="mb-6">

        @csrf

        <input type="file" name="gallery[]" multiple class="text-gray-300">

        <button class="px-4 py-2 bg-blue-600 rounded mt-2">
            Добавить фото
        </button>
    </form>



    {{-- 🖼 Вывод галереи --}}
    <div class="grid grid-cols-4 gap-4">

        @foreach ($product->gallery ?? [] as $i => $img)
            <div class="relative">

                <img src="{{ asset('storage/' . $img) }}" class="rounded border border-slate-700 h-32 w-full object-cover">

                {{-- кнопка удаления --}}
                <form method="POST" action="{{ route('admin.products.gallery.delete', [$product->id, $i]) }}"
                    class="absolute -top-2 -right-2">

                    @csrf
                    @method('DELETE')

                    <button onclick="return confirm('Удалить это фото?')"
                        class="bg-red-600 text-white rounded-full px-2 text-xs">
                        ✕
                    </button>

                </form>

            </div>
        @endforeach

    </div>

@endsection
