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
        $today = now()->format('Y-m-d');
        $votes = Vote::where('vote_date', '=', $today)->get();

        if ($votes->isEmpty()) { // Don't send notifications if no votes were found
            $this->info('No votes found for ' . $today);
            return;
        }

        $this->info('Found ' . $votes->count() . ' votes for ' . $today);

        $users = User::all();
        foreach ($users as $user) {
            $user->notify(new DigestVotesNotification($votes));
        }
    }
}
