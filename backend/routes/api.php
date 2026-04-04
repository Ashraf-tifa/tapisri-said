<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductImageController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

// Auth routes
Route::post('/login', [AuthController::class, 'login']);

// Admin protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/admin/change-password', [AuthController::class, 'changePassword']);

    Route::apiResource('/admin/categories', CategoryController::class)->except(['index', 'show']);
    Route::apiResource('/admin/products', ProductController::class)->except(['index', 'show']);

    // Product images
    Route::post('/admin/products/{product}/images', [ProductImageController::class, 'store']);
    Route::patch('/admin/products/{product}/images/{image}/main', [ProductImageController::class, 'setMain']);
    Route::delete('/admin/products/{product}/images/{image}', [ProductImageController::class, 'destroy']);
});
