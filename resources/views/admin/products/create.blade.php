@extends('layouts.admin')
@section('title', 'Добавить товар')
@section('content')
    <form method="post" enctype="multipart/form-data" action="{{ route('admin.products.store') }}" class="space-y-4">
        @csrf
        <input name="name" class="w-full bg-slate-800 border p-2 rounded" placeholder="Название" value="{{ old('name') }}">
        @error('name')
            <span class="style: bg-red-600">
                {{ $message }}
            </span>
        @enderror
        <select name="category_id" class="w-full bg-slate-800 border p-2 rounded">
            @foreach ($categories as $category)
                <option value="{{ $category->id }}" @selected(old('category_id', $product->category_id ?? null) == $category->id)>
                    {{ $category->name }}
                </option>
            @endforeach
        </select>
        <input name="price" type="number" class="w-full bg-slate-800 border p-2 rounded" placeholder="Цена"
            value="{{ old('price') }}">
        @error('price')
            <span class="style: bg-red-600">
                {{ $message }}
            </span>
        @enderror
        <input name="quantity" type="number" class="w-full bg-slate-800 border p-2 rounded" placeholder="Количество"
            value="{{ old('quantity') }}">
        @error('quantity')
            <span class="style: bg-red-600">
                {{ $message }}
            </span>
        @enderror
        <textarea name="description" class="w-full bg-slate-800 border p-2 rounded" placeholder="Описание">{{ old('description') }}</textarea>
        @error('description')
            <span class="style: bg-red-600">
                {{ $message }}
            </span>
        @enderror
        <label class="block text-sm text-gray-300 mb-1">Статус</label>
        <select name="status" class="w-full bg-slate-800 border p-2 rounded">
            <option value="available">В наличии</option>
            <option value="unavailable">Нет в наличии</option>
            <option value="archived">Архив</option>
        </select>
        <label class="block text-sm text-gray-300 mb-1">Главное фото</label>
        <input type="file" name="image" class="text-sm text-gray-300">
        @error('image')
            <span class="style: bg-red-600">
                {{ $message }}
            </span>
        @enderror
        <label class="block text-sm text-gray-300 mb-1">Галерея (несколько фото)</label>
        <input type="file" name="gallery[]" multiple class="text-sm text-gray-300">
        <button type="submit" class="px-4 py-2 bg-green-500 rounded">
            💾 Сохранить
        </button>
    </form>
@endsection
