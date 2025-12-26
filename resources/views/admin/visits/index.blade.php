@extends('layouts.admin')

@section('content')
<h1 class="text-xl font-bold mb-4">Посещения сайта</h1>

<table class="w-full">
<thead>
<tr>
    <th>ID</th>
    <th>Пользователь</th>
    <th>IP</th>
    <th>URL</th>
    <th>Браузер</th>
    <th>Дата</th>
</tr>
</thead>

<tbody>
@foreach($visits as $visit)
<tr>
    <td>{{ $visit->id }}</td>
    <td>{{ $visit->user->name ?? 'Гость' }}</td>
    <td>{{ $visit->ip }}</td>
    <td>{{ $visit->url }}</td>
    <td>{{ $visit->user_agent }}</td>
    <td>{{ $visit->created_at }}</td>
</tr>
@endforeach
</tbody>
</table>

{{ $visits->links() }}

@endsection
