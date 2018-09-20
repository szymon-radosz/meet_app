<?php

Route::get('/', function () {
    return view('index');
});

Route::get('{slug}', function () {
    return view('index');
})->where('slug', '(?!api)([A-z\d-\/_.]+)?');

