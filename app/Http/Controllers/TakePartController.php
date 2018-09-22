<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\TakePart;
use Response;
use DB;

class TakePartController extends Controller
{
    public function index()
    {
        $allTakePart = DB::table('take_part')->get();
        return $allTakePart;
    }

    public function store(Request $request)
    {
        $takePart = new takePart;

        $takePart->userId = $request->userId;
        $takePart->meetingId = $request->meetingId;
       
        $takePart->save();
    }

    public function findById($id)
    {
        $singleTakePart = DB::table('take_part')->where('id', $id)->get();
        return $singleTakePart;
    }
}
