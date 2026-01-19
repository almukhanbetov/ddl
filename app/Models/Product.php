<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'price',
        'quantity',
        'description',
        'image',
        'gallery',
        'status'
    ];

    protected $casts = [
        'gallery' => 'array'
    ];
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function isAvailableOn($date)
    {
        return !$this->bookings()
            ->whereDate('start_date', '<=', $date)
            ->whereDate('end_date', '>=', $date)
            ->exists();
    }
}
