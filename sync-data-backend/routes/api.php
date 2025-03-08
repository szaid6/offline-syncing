<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::get('/ping', function () {
    return response()->json('pong');
});

Route::prefix('v1')->group(function () {
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/add', [UserController::class, 'add']);
    });
});
