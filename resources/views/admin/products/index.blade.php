@extends('layouts.admin')

@section('title', 'Товары')

@section('content')

    <a href="{{ route('admin.products.create') }}" class="px-4 py-2 bg-green-500 rounded hover:bg-green-600">
        ➕ Добавить товар
    </a>

    <div class="mt-6 bg-slate-800 border border-slate-700 rounded-lg p-4">

        <table class="w-full">
            <thead class="text-gray-400">
                <tr>
                    <th class="text-left p-2">Фото</th>
                    <th class="text-left p-2">Название</th>
                    <th class="text-left p-2">Цена</th>
                    <th class="text-left p-2">Кол-во</th>
                    <th class="text-left p-2">Статус</th>
                    <th class="text-left p-2"></th>
                </tr>
            </thead>

            <tbody>
                @forelse($products as $product)
                    <tr class="border-t border-slate-700">
                        <td class="p-2">
                            @if ($product->image)
                                <img src="/storage/{{ $product->image }}" class="h-12 rounded">
                            @endif
                        </td>
                        <td class="p-2">{{ $product->name }}</td>
                        <td class="p-2 text-green-400">{{ $product->price }} тг</td>
                        <td class="p-2">{{ $product->quantity }}</td>
                        <td class="p-2">
                            @if ($product->status === 'available')
                                <span class="text-green-400">в наличии</span>
                            @else
                                <span class="text-red-400">нет</span>
                            @endif
                        </td>
                        <td class="px-4 py-3 flex gap-2">

                            {{-- SHOW — глаз --}}
                            <a href="{{ route('admin.products.show', $product) }}"
                                class="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-blue-400 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5
                         s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7
                         s-8.268-2.943-9.542-7z" />
                                    <circle cx="12" cy="12" r="3" stroke-width="2" />
                                </svg>
                            </a>


                            {{-- EDIT — карандаш --}}
                            <a href="{{ route('admin.products.edit', $product) }}"
                                class="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-yellow-400 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2 2 0 112.828 2.828L12 13
                         l-4 1 1-4z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h6" />
                                </svg>
                            </a>


                            {{-- DELETE — крестик / корзина --}}
                            <form method="POST" action="{{ route('admin.products.destroy', $product) }}"
                                onsubmit="return confirm('Удалить товар?')">
                                @csrf
                                @method('DELETE')

                                <button class="p-2 rounded-lg bg-slate-700 hover:bg-red-600 text-red-400 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </form>

                        </td>


                    </tr>
                @empty
                    <p>Товаров пока нет</p>
                @endforelse
            </tbody>
        </table>

    </div>

@endsection
