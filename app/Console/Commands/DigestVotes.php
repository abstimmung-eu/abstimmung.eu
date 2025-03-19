<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Vote;
use App\Notifications\DigestVotesNotification;
use Illuminate\Console\Command;

class DigestVotes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:digest-votes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // get today's date
        $today = now()->format('Y-m-d');
        // get all votes from today
        $votes = Vote::where('vote_date', '=', $today)->get();

        // users 
        $users = User::all();
        foreach ($users as $user) {
            $this->info('Processing user ' . $user->id);
            $user->notify(new DigestVotesNotification($votes));
        }


        $this->info('Found ' . $votes->count() . ' votes for ' . $today);
    }
}
