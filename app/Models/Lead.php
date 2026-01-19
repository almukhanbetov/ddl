<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'source',
        'phone',
        'email',
        'total_price',
        'cart',
        'utm',
        'ip',
        'user_agent',
        'status',
    ];

    protected $casts = [
        'cart' => 'array',
        'utm'  => 'array',
    ];
}
