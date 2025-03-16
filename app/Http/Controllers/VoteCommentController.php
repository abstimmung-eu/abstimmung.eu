<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use BeyondCode\Comments\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoteCommentController extends Controller
{
    public function store(Request $request, Vote $vote)
    {
        $request->validate([
            'content' => 'required|string|max:500',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        if ($request->reply_id) {
            $reply = Comment::findOrFail($request->reply_id);
            $reply->commentAsUser($request->user(), $request->content);
        } else {
            $vote->commentAsUser($request->user(), $request->content);
        }

        return redirect()->back()->with('success', 'Comment added successfully');
    }

    public function destroy(Comment $comment)
    {
        // Check if the authenticated user is the owner of the comment
        if (Auth::user()->id !== $comment->commentator->id) {
            return redirect()->back()->with('error', 'Sie sind nicht berechtigt, diesen Kommentar zu löschen');
        }
        
        $comment->delete();

        return redirect()->back()->with('success', 'Comment deleted successfully');
    }
}
