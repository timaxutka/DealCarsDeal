<?php

namespace App\Http\Controllers;

use App\Models\Car; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CarController extends Controller
{
    public function index()
    {
        return Car::with('dealer')->get(); 
    }

    public function store(Request $request)
    {
        $car = new Car;
        $car->firm = $request->firm;
        $car->model = $request->model;
        $car->year = $request->year;
        $car->power = $request->power;
        $car->color = $request->color;
        $car->price = $request->price;
        $car->dealer_id = $request->dealer_id;
        $car->save();

        $message = [
            'action' => 'add',
            'id' => $car->id,
            'message' => 'Car added successfully',
        ];

        return response()->json(['message' => 'Car added successfully'], 201);
    }

public function update(Request $request, $id)
{
    try {
        $car = Car::findOrFail($id);

        $validated = $request->validate([
            'firm' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'year' => 'nullable|integer',
            'color' => 'nullable|string|max:50',
            'price' => 'nullable|numeric',
            'dealer_id' => 'nullable|integer|exists:dealers,id',
        ]);

        $car->update($validated);

        return response()->json($car);
    } catch (\Exception $e) {
        Log::error('Ошибка обновления машины: ' . $e->getMessage());
        return response()->json(['message' => 'Ошибка обновления машины'], 500);
    }
}


    public function destroy($id)
    {
        $car = Car::find($id);
        
        if ($car) {
            $car->delete();
            return response()->json(['message' => 'Car deleted successfully']);
        } else {
            return response()->json(['message' => 'Car not found'], 404);
        }
    }
}
