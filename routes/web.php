<?php

use App\Http\Controllers\CartController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/produkpage', function () {
        return Inertia::render('produkpage');
    })->name('produkpage');

    Route::get('/pengiriman', function () {
        return Inertia::render('pengiriman');
    })->name('pengiriman.index');

    Route::get('/laporan', function () {
        return Inertia::render('laporan');
    })->name('laporan');

    Route::get('/keranjang', function () {
    return Inertia::render('Keranjang');
    })->name('keranjang');

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
