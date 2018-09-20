<?php

use Illuminate\Http\Request;

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('meetings','MeetingController@index');
Route::get('meeting/{id}','MeetingController@findById');
Route::delete('meeting/{id}','MeetingController@destroy');
Route::put('meeting','MeetingController@store');
Route::post('meeting','MeetingController@store');

Route::get('users','UserController@index');
Route::get('user/{id}','UserController@findById');
Route::delete('user/{id}','UserController@destroy');
Route::put('user','UserController@store');
Route::post('user','UserController@store');

Route::get('comments','CommentController@index');
Route::get('comment/{id}','CommentController@findById');
Route::post('comment','CommentController@store');

Route::get('deleteUserFromMeeting','DeleteUserFromMeetingController@index');
Route::get('deleteUserFromMeeting/{id}','DeleteUserFromMeetingController@findById');
Route::post('deleteUserFromMeeting','DeleteUserFromMeetingController@store');

Route::get('matchUserWithMeeting','MatchUserWithMeeting@index');
Route::get('matchUserWithMeeting/{id}','MatchUserWithMeeting@findById');
Route::post('matchUserWithMeeting','MatchUserWithMeeting@store');
Route::delete('matchUserWithMeeting/{id}','MatchUserWithMeeting@destroy');

Route::get('takePart','TakePartController@index');
Route::get('takePart/{id}','TakePartController@findById');
Route::post('takePart','TakePartController@store');
