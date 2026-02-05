<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return "API is running";
});

Route::get('/login', function () {
    return response()->json(['message' => 'Please login'], 401);
})->name('login');
