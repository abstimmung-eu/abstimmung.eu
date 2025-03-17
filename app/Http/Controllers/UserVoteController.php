<?php

namespace App\Http\Controllers;

use App\Models\UserVote;
use App\Models\UserVoteParticipation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UserVoteController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) return redirect()->back()->with('error', 'Sie müssen sich anmelden, um abzustimmen.');

        $validVotePosition = ['for', 'against', 'abstention'];
        $validAgeGroups = ['17_and_under', '18_to_24', '25_to_34', '35_to_44', '45_to_54', '55_to_64', '65_plus'];
        $validGenders = ['male', 'female', 'other'];
        $validMaritalStatus = ['single', 'married_or_civil_union', 'separated', 'divorced', 'widowed'];
        $validEducation = ['no_degree', 'primary', 'secondary', 'vocational', 'abitur', 'bachelor', 'master', 'doctorate'];
        $validCurrentActivity = [
            'attending_school', 'studying', 'vocational_training', 'retraining',
            'voluntary_military_service', 'bfd_fsj_fej', 'career_break', 'employed',
            'retired', 'unemployed', 'permanently_unfit', 'household_management', 'other'
        ];
        $validHouseholdSize = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10_or_more'];
        $validFederalState = [
            'baden_wuerttemberg', 'bayern', 'berlin', 'brandenburg',
            'bremen', 'hamburg', 'hessen', 'mecklenburg_vorpommern',
            'niedersachsen', 'nordrhein_westfalen', 'rheinland_pfalz',
            'saarland', 'sachsen', 'sachsen_anhalt', 'schleswig_holstein',
            'thueringen'
        ];
        $validIncome = [
            'under_500', '500_749', '750_999', '1000_1249',
            '1250_1499', '1500_1749', '1750_1999', '2000_2249',
            '2250_2499', '2500_2749', '2750_2999', '3000_3249',
            '3250_3499', '3500_3999', '4000_4499', '4500_4999',
            '5000_5999', '6000_6999', '7000_7999', '8000_9999',
            '10000_14999', '15000_24999', '25000_plus'
        ];
        $validPoliticalAffiliations = ['very_conservative', 'conservative', 'middle', 'liberal', 'very_liberal', 'no_opinion'];

        $validated = $request->validate([
              'vote_id' => 'required|exists:votes,id',
              'vote_position' => ['required', Rule::in($validVotePosition)],
              'demographics.age_group' => ['required', Rule::in($validAgeGroups)],
              'demographics.gender' => ['required', Rule::in($validGenders)],
              'demographics.marital_status' => ['required', Rule::in($validMaritalStatus)],
              'demographics.education' => ['required', Rule::in($validEducation)],
              'demographics.current_activity' => ['required', Rule::in($validCurrentActivity)],
              'demographics.household_size' => ['required', Rule::in($validHouseholdSize)],
              'demographics.federal_state' => ['required', Rule::in($validFederalState)],
              'demographics.income' => ['required', Rule::in($validIncome)],
              'demographics.political_affiliation' => ['required', Rule::in($validPoliticalAffiliations)],
        ]);

        $vote_id = $request->vote_id;
        $vote_position = $request->vote_position;

        // Check if user has already participated in this vote
        $existingParticipation = UserVoteParticipation::where('vote_id', $vote_id)
            ->where('user_id', $user->id)
            ->exists();

        if ($existingParticipation) {
            return redirect()->back()->with('error', 'Sie haben bereits an dieser Abstimmung teilgenommen.');
        }

        // Store anonymous user vote
        $userVote = UserVote::create([
            'vote_id' => $vote_id,
            'vote_position' => $vote_position,
            'age_group' => $request->demographics['age_group'],
            'gender' => $request->demographics['gender'],
            'marital_status' => $request->demographics['marital_status'],
            'education' => $request->demographics['education'],
            'current_activity' => $request->demographics['current_activity'],
            'household_size' => $request->demographics['household_size'],
            'federal_state' => $request->demographics['federal_state'],
            'income' => $request->demographics['income'],
            'political_affiliation' => $request->demographics['political_affiliation'],
        ]);

        // Store user vote participation
        UserVoteParticipation::create([
            'vote_id' => $vote_id,
            'user_id' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Ihre Stimme wurde erfolgreich abgegeben.');
    }
}
