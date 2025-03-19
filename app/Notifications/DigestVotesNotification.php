<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class DigestVotesNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private Collection $votes;

    /**
     * Create a new notification instance.
     */
    public function __construct(Collection $votes)
    {
        $this->votes = $votes;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Der Bundestag hat heute ' . $this->votes->count() . ' mal abgestimmt')
            ->greeting('Hallo!')
            ->line('Im Bundestag wurde heute ' . $this->votes->count() . ' mal namentlich zu den folgenden Themen abgestimmt:')
            ->line($this->generateHtml($this->votes))
            ->salutation(new HtmlString('Mit freundlichen Grüßen, <br>' . config('app.name')));
    }

    private function generateHtml(Collection $votes): HtmlString
    {
        $count = 1;
        $message = '';
        foreach ($votes as $vote) {
            $message .= "<b>$count. </b><a href=" . route('vote.show', $vote->id) . '>' . $vote->title . '</a> <br>';
            $message .= $vote->summary . "\n\n";
            $count++;
        }

        return new HtmlString(nl2br($message));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
                //
            ];
    }
}
