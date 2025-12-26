<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use Illuminate\Http\Request;

class VisitController extends Controller
{
        public function index()
        {
            $visits = Visit::latest()->paginate(50);

            return view('admin.visits.index', compact('visits'));
        }
}
