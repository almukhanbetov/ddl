@extends('layouts.admin')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between mb-4">
        <h2>➕ Новая категория</h2>
        <a href="{{ route('admin.categories.index') }}" class="btn btn-outline-secondary">
            ← Назад
        </a>
    </div>

    <div class="card shadow-sm border-0">
        <div class="card-body">
            <form method="POST" action="{{ route('admin.categories.store') }}">
                @csrf

                <div class="mb-3">
                    <label class="form-label">Название категории</label>
                    <input type="text"
                           name="name"
                           class="form-control"
                           value="{{ old('name') }}"
                           required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Родительская категория</label>
                    <select name="parent_id" class="form-select">
                        <option value="">— Без родителя —</option>
                        @foreach($parents as $parent)
                            <option value="{{ $parent->id }}">
                                {{ $parent->name }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <button class="btn btn-success">
                    💾 Сохранить категорию
                </button>
            </form>
        </div>
    </div>
</div>
@endsection
