@extends('layouts.admin')

@section('content')
<div class="p-6">
    <h1 class="text-2xl font-semibold mb-6 text-slate-100">
        📋 Лиды
    </h1>

    <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table class="w-full text-sm text-slate-300">
            <thead class="bg-slate-800/70 text-slate-400 uppercase text-xs">
                <tr>
                    <th class="px-4 py-3 text-left">ID</th>
                    <th class="px-4 py-3 text-left">Источник</th>
                    <th class="px-4 py-3 text-left">Телефон</th>
                    <th class="px-4 py-3 text-left">Сумма</th>
                    <th class="px-4 py-3 text-left">Корзина</th>
                    <th class="px-4 py-3 text-left">UTM</th>
                    <th class="px-4 py-3 text-left">Статус</th>
                    <th class="px-4 py-3 text-right">Дата</th>
                </tr>
            </thead>

            <tbody class="divide-y divide-slate-800">
                @foreach($leads as $lead)
                <tr class="hover:bg-slate-800/40 transition">
                    <td class="px-4 py-3 text-slate-400">#{{ $lead->id }}</td>

                    <td class="px-4 py-3">
                        <span class="px-2 py-1 rounded-md text-xs font-medium
                            {{ $lead->source === 'whatsapp'
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-blue-500/10 text-blue-400' }}">
                            {{ $lead->source }}
                        </span>
                    </td>

                    <td class="px-4 py-3 font-medium text-slate-200">
                        {{ $lead->phone ?? '—' }}
                    </td>

                    <td class="px-4 py-3 font-semibold text-emerald-400">
                        {{ number_format($lead->total_price, 0, '.', ' ') }} ₸
                    </td>

                    <td class="px-4 py-3">
                        <ul class="space-y-1">
                            @foreach($lead->cart ?? [] as $item)
                                <li class="text-slate-300">
                                    {{ $item['product']['name'] ?? '' }}
                                    <span class="text-slate-500">× {{ $item['qty'] }}</span>
                                </li>
                            @endforeach
                        </ul>
                    </td>

                    <td class="px-4 py-3 text-xs text-slate-500">
                        {{ $lead->utm['utm_source'] ?? '—' }}
                    </td>

                    <td class="px-4 py-3">
                        <form method="POST" action="{{ route('admin.leads.status', $lead) }}">
                            @csrf
                            <select name="status"
                                onchange="this.form.submit()"
                                class="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs
                                focus:outline-none focus:ring-1 focus:ring-emerald-500">
                                @foreach(['new','contacted','closed'] as $status)
                                    <option value="{{ $status }}"
                                        @selected($lead->status === $status)>
                                        {{ ucfirst($status) }}
                                    </option>
                                @endforeach
                            </select>
                        </form>
                    </td>

                    <td class="px-4 py-3 text-right text-xs text-slate-500">
                        {{ $lead->created_at->format('d.m.Y H:i') }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
