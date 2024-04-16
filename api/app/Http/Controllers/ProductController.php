<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Requests\ProductRequest;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            return response()->json([
                'status' => 'success',
                'products' => Product::with('category')->get(),
            ]);
        } catch (\Exception $e) {
            return response()->json($e);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        try {
            $validatedData = $request->validated();

            $product = Product::create($validatedData);

            return response()->json([
                'status' => 'success',
                'message' => 'Le produit a bien été créé.',
                'product' => $product,
            ]);
        } catch (\Exception $e) {
            return response()->json($e);
        }
    }
    // public function store(ProductRequest $request)
    // {
    //     try {
    //         $validatedData = $request->validated();
    //         $image = $validatedData['image'];
    //         $imageName = Str::random() . '.' . $image->getClientOriginalExtension();
    //         Storage::disk('public')->putFileAs('product/image', $image, $imageName);

    //         $validatedData['image'] = $imageName;
    //         $validatedData['category_id'] = 2;

    //         $product = Product::create($validatedData);

    //         return response()->json([
    //             'status' => 'success',
    //             'message' => 'Le produit a bien été créé.',
    //             'product' => $product,
    //         ]);
    //     } catch (\Exception $e) {
    //         return response()->json($e);
    //     }
    // }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        try {
            return response()->json([
                'status' => 'success',
                'product' => $product,
            ]);
        } catch (\Exception $e) {
            return response()->json($e);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, Product $product)
    {
        try {
            $validatedData = $request->validated();

            if ($request->hasFile('image')) {
                // Supprimer l'ancienne image si elle existe
                if ($product->image) {
                    $exists = Storage::disk('public')->exists('product/image/' . $product->image);
                    if ($exists) {
                        Storage::disk('public')->delete('product/image/' . $product->image);
                    }
                }

                // Téléverser la nouvelle image
                $image = $request->file('image');
                $imageName = Str::random() . '.' . $image->getClientOriginalExtension();
                Storage::disk('public')->putFileAs('product/image', $image, $imageName);
                $validatedData['image'] = $imageName;
            }

            // Mettre à jour les autres champs du produit
            $updateProduct = $product->update($validatedData);

            return response()->json([
                'status' => 'success',
                'message' => 'Le produit a bien été modifié.',
                'product' => $updateProduct,
            ]);
        } catch (\Exception $e) {
            return response()->json($e);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            // Supprimer l'image associée au produit s'il en existe une
            if ($product->image) {
                $exists = Storage::disk('public')->exists('product/image/' . $product->image);
                if ($exists) {
                    Storage::disk('public')->delete('product/image/' . $product->image);
                }
            }

            // Supprimer le produit de la base de données
            $product->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Le produit a bien été supprimé.',
            ]);
        } catch (\Exception $e) {
            return response()->json($e);
        }
    }
}
