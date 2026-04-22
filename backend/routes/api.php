<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;

Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/profile', [AuthController::class, 'profile'])->middleware('auth:api');
});

// We can protect the books endpoint or leave it public. Here we protect it using the JWT guard.
Route::middleware('auth:api')->group(function () {
    Route::apiResource('books', BookController::class);
});
