<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('is_deleted', 0)->get();
        return response()->json($users);
    }

    // manage add and update both in single function
    public function add(Request $request)
    {
        $data = $request->all();

        if (User::where('email', $data['email'])->exists()) {
            return response()->json([
                'message' => 'Email already exists'
            ], 200);
        }

        $user = new User();
        $user->first_name = $data['first_name'];
        $user->last_name = $data['last_name'];
        $user->email = $data['email'];
        $user->phone = $data['phone'];
        $user->address = $data['address'];
        $user->dob = $data['dob'];
        $user->gender = $data['gender'] ? Str::ucfirst($data['gender']) : "Other";
        $user->save();

        return response()->json([
            'message' => 'User added successfully'
        ]);
    }
}
