<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $table = 'cars';
    protected $primaryKey = 'id';

    protected $fillable = [
        'firm', 
        'model', 
        'year', 
        'color', 
        'price', 
        'id'
    ];
    public $timestamps = false;
    public function dealer()
    {
        return $this->belongsTo(Dealer::class, 'id');
    }
}
