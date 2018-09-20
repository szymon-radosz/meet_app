<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Comment;
use Response;
use DB;

class CommentController extends Controller
{
    public function index()
    {
        $allComments = DB::table('comments')->get();
        return $allComments;
    }

    public function store(Request $request)
    {
        $comment = new Comment;

        $comment->meetingId = $request->meetingId;
        $comment->userId = $request->userId;
        $comment->userEmail = $request->userEmail;
        $comment->date = $request->date;
        $comment->commentBody = $request->commentBody;
       
        $comment->save();
    }

    public function findById($id)
    {
        $singleComment = DB::table('comments')->where('id', $id)->get();
        return $singleComment;
    }
}
