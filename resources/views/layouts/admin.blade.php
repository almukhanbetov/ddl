<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Admin Panel')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="bg-[var(--stake-bg)] text-gray-200">
    <div class="flex">
        <!-- LEFT SIDEBAR -->
        <aside class="w-64 h-screen bg-slate-900 border-r border-slate-700 p-4">
            <h2 class="text-xl font-bold mb-6 text-green-400">
                Admin Panel ({{ auth()->user()->name }})
            </h2>
            <nav class="space-y-2">
                <a href="{{ route('admin.products.index') }}" class="block px-3 py-2 rounded hover:bg-slate-700">
                    📦 Товары
                </a>
                {{-- <a href="{{ route('admin.bookings.index') }}"
               class="block px-3 py-2 rounded hover:bg-slate-700">
                📅 Бронирования
            </a> --}}
                 <a href="{{ route('admin.leads.index') }}" class="block px-3 py-2 rounded hover:bg-slate-700">
                    📥 Лиды
                </a>
                <a href="{{ route('admin.users.index') }}" class="block px-3 py-2 rounded hover:bg-slate-700">
                    📅 Пользователь
                </a>
                <a href="{{ route('admin.visits.index') }}" class="block px-3 py-2 rounded hover:bg-slate-700">
                    📅 Посетившие онлайн
                </a>
                <a href="{{ route('pages.index') }}" class="block px-3 py-2 rounded hover:bg-slate-700">
                    ⬅ Вернуться на сайт
                </a>
               
            </nav>
        </aside>
        <!-- MAIN -->
        <main class="flex-1 p-8">
            <h1 class="text-2xl font-bold mb-6 text-white">
                @yield('title')
            </h1>
            @yield('content')
        </main>
    </div>
</body>

</html>
