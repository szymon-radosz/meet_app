<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\DeleteUserFromMeeting;
use Response;
use DB;

class DeleteUserFromMeetingController extends Controller
{
    public function index()
    {
        $allDeleteUserFromMeeting = DB::table('deleteUserFromMeeting')->get();
        return $allDeleteUserFromMeeting;
    }

    public function store(Request $request)
    {
        $deleteUserFromMeeting = new deleteUserFromMeeting;

        $deleteUserFromMeeting->userId = $request->userId;
        $deleteUserFromMeeting->meetingId = $request->meetingId;
       
        $deleteUserFromMeeting->save();
    }

    public function findById($id)
    {
        $singleDeleteUserFromMeeting = DB::table('deleteUserFromMeeting')->where('id', $id)->get();
        return $singleDeleteUserFromMeeting;
    }
}
