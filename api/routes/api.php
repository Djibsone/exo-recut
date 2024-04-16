<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('/products')->controller(ProductController::class)->group(function () {
    Route::get('/', 'index');
    Route::post('/create', 'store');
    Route::get('/{product}', 'show');
    Route::put('/{product}', 'update');
    Route::delete('/{product}', 'destroy');

});

Route::prefix('/categories')->controller(CategoryController::class)->group(function () {
    Route::get('/', 'index');
    Route::post('/create', 'store');
    Route::get('/{category}', 'show');
    Route::put('/{category}', 'update');
    Route::delete('/{category}', 'destroy');

});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
