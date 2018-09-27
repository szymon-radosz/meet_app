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

    public function login(Request $request){
        $nickName = $request->input('emailOrNickname');
        $password = $request->input('password');

        $user = DB::table('users')->where('nickName', $nickName)->orWhere('email', $nickName)->where('password', $password)->first();

        if($user){
            $userId = $user->id;
            $userNickName = $user->nickName;
        }else{
            $userId = null;
            $userNickName = null;
        }

        $userInfo = (object) ['userId' => $userId, 'userNickName' => $nickName];

        return Response::json($userInfo);
    }

    public function store(Request $request)
    {
        $user = new User;

        $user->firstName = $request->firstName;
        $user->lastName = $request->lastName;
        $user->age = $request->age;
        $user->description = $request->description;
        $user->nickName = $request->nickName;
        $user->email = $request->email;
        $user->location = $request->location;
        $user->password = $request->password;
        $user->passwordConfirmation = $request->passwordConfirmation;

        $user->save();

        $userInfo = (object) ['userId' => $user->id, 'userNickName' => $user->nickName];

        return Response::json($userInfo);
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
