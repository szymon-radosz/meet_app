<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\MatchUserWithMeeting;
use Response;
use DB;


class matchUserWithMeetingController extends Controller
{
    public function index()
    {
        $allMatchUserWithMeeting = DB::table('matchUserWithMeeting')->get();
        return $allMatchUserWithMeeting;
    }

    public function store(Request $request)
    {
        $matchUserWithMeeting = new deleteUserFromMeeting;

        $matchUserWithMeeting->userId = $request->userId;
        $matchUserWithMeeting->meetingId = $request->meetingId;
       
        $matchUserWithMeeting->save();
    }

    public function findById($id)
    {
        $singleMatchUserWithMeeting = DB::table('matchUserWithMeeting')->where('id', $id)->get();
        return $singleMatchUserWithMeeting;
    }

    public function destroy($id)
    {
        $singleMatchUserWithMeeting = DB::table('matchUserWithMeeting')->where('id', $id)->delete();
        return;
    }
}
