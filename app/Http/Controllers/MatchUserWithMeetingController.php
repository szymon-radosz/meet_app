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
        $allMatchUserWithMeeting = DB::table('match_user_with_meetings')->get();
        return $allMatchUserWithMeeting;
    }

    public function store(Request $request)
    {
        $matchUserWithMeeting = new MatchUserWithMeeting;

        $matchUserWithMeeting->userId = $request->userId;
        $matchUserWithMeeting->meetingId = $request->meetingId;
       
        $matchUserWithMeeting->save();
    }

    public function findById($id)
    {
        $singleMatchUserWithMeeting = DB::table('match_user_with_meetings')->where('id', $id)->get();
        return $singleMatchUserWithMeeting;
    }

    public function destroy($id)
    {
        $singleMatchUserWithMeeting = DB::table('match_user_with_meetings')->where('id', $id)->delete();
        return;
    }
}
