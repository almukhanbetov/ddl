@extends('layouts.admin')

@section('title','Редактировать пользователя')

@section('content')

<h2 class="text-xl font-bold mb-4">
    Редактирование: {{ $user->name }}
</h2>

<form method="POST" action="{{ route('admin.users.update', $user) }}">
    @csrf
    @method('PUT')

    <label class="block">Роль</label>

    <select name="role"
            class="bg-slate-800 border p-2 rounded mt-1">

        <option value="user" {{ $user->role=='user'?'selected':'' }}>User</option>
        <option value="student" {{ $user->role=='student'?'selected':'' }}>Student</option>
        <option value="mentor" {{ $user->role=='mentor'?'selected':'' }}>Mentor</option>
        <option value="admin" {{ $user->role=='admin'?'selected':'' }}>Admin</option>

    </select>

    <button class="mt-4 bg-green-600 px-3 py-2 rounded">
        Сохранить
    </button>

</form>

@endsection
