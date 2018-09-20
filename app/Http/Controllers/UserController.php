<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\User;
use Response;
use DB;

class UserController extends Controller
{
    public function index()
    {
        $allUsers = DB::table('users')->get();
        return $allUsers;
    }

    public function store(Request $request)
    {
        $user = new User;

        $user->firstName = $request->firstName;
        $user->lastName = $request->lastName;
        $user->age = $request->age;
        $user->description = $request->description;
        $user->nickName = $request->nickName;
        $user->location = $request->location;
        $user->password = $request->password;
        $user->passwordConfirmation = $request->passwordConfirmation;

        $user->save();
    }

    public function findById($id)
    {
        $singleUser = DB::table('users')->where('id', $id)->get();
        return $singleUser;
    }

    public function edit($id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        //
    }
    
    public function destroy($id)
    {
        //
    }
}
