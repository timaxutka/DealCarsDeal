<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dealer extends Model
{
    use HasFactory;

    protected $table = 'dealers';
    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'city',
        'address',
        'area',
        'rating',
    ];
    public $timestamps = false;

    public function cars()
    {
        return $this->hasMany(Car::class, 'id');
    }
}
