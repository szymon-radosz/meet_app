<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Meeting;
use Response;
use DB;

class MeetingController extends Controller
{
    public function index()
    {
        $allMeeting = DB::table('meetings')->get();
        return $allMeeting;
    }

    public function store(Request $request)
    {
        $meeting = new Meeting;

        $meeting->title = $request->title;
        $meeting->description = $request->description;
        $meeting->author = $request->author;
        $meeting->lattitude = $request->lattitude;
        $meeting->longitude = $request->longitude;
        $meeting->limit = $request->limit;
        $meeting->category = $request->category;
        $meeting->date = $request->date;

        $meeting->save();
    }

    public function findById($id)
    {
        $singleMeeting = DB::table('meetings')->where('id', $id)->get();
        return $singleMeeting;
    }



    public function destroy($id)
    {
        //
    }
}
