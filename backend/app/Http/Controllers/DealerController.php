<?php

namespace App\Http\Controllers;

use App\Models\Dealer;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;

class DealerController extends Controller
{
    public function index()
    {
        return Dealer::with('cars')->get();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'area' => 'required|string|max:255',
            'rating' => 'nullable|numeric|min:0|max:5',
        ]);

        $dealer = Dealer::create($validatedData);
        return response()->json($dealer, 201);
    }

    public function update(Request $request, $id)
    {
        try {
        $dealer = Dealer::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255',
            'area' => 'sometimes|string|max:255',
            'rating' => 'nullable|numeric|min:0|max:5',
        ]);

        $dealer->update($validatedData);
        return response()->json($dealer, 200);
        } catch (\Exception $e) {
        Log::error('Ошибка обновления машины: ' . $e->getMessage());
        return response()->json(['message' => 'Ошибка обновления машины'], 500);
    }
    }

    public function destroy($id)
    {
        $dealer = Dealer::findOrFail($id);
        $dealer->delete();

        return response()->json(['message' => 'Dealer deleted successfully.'], 200);
    }
}
