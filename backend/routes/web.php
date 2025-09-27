<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CarController;
use App\Http\Controllers\DealerController;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/cars', [CarController::class, 'index']);
Route::get('/dealers', [DealerController::class, 'index']);
Route::post('/cars', [CarController::class, 'store'])->name('cars.store');
Route::put('/cars/{id}', [CarController::class, 'update']);
Route::delete('/cars/{id}', [CarController::class, 'destroy'])->name('cars.destroy');
Route::post('/dealers', [DealerController::class, 'store']);
Route::put('/dealers/{dealerid}', [DealerController::class, 'update']);
Route::delete('/dealers/{dealerid}', [DealerController::class, 'destroy']);



