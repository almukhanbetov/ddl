<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;

class AdminLeadController extends Controller
{
    public function index()
    {
        $leads = Lead::latest()->paginate(20); 
        return view('admin.leads.index', compact('leads'));
    }

    public function updateStatus(Request $request, Lead $lead)
    {
        $request->validate([
            'status' => 'required|string'
        ]);

        $lead->update([
            'status' => $request->status
        ]);

        return back();
    }
}
