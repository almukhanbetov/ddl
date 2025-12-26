@extends('layouts.admin')

@section('title','Пользователи')

@section('content')

<h2 class="text-xl font-bold mb-4">Пользователи</h2>

<table class="w-full">
    <tr class="text-left border-b border-slate-700">
        <th class="p-2">ID</th>
        <th class="p-2">Имя</th>
        <th class="p-2">Email</th>
        <th class="p-2">Роль</th>
        <th class="p-2"></th>
    </tr>

    @foreach($users as $user)
    <tr class="border-b border-slate-800">
        <td class="p-2">{{ $user->id }}</td>
        <td class="p-2">{{ $user->name }}</td>
        <td class="p-2">{{ $user->email }}</td>
        <td class="p-2">{{ $user->role }}</td>
        <td class="p-2">
            <a class="text-blue-400"
               href="{{ route('admin.users.edit', $user) }}">
                ✏️
            </a>
        </td>
    </tr>
    @endforeach
</table>

<div class="mt-4">
    {{ $users->links() }}
</div>

@endsection
