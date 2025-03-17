<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\SMS77\SMS77Channel;
use NotificationChannels\SMS77\SMS77Message;

class VerifyPhoneNotification extends Notification
{
    use Queueable;

    private string $otp;

    /**
     * Create a new notification instance.
     */
    public function __construct($otp)
    {
        $this->otp = $otp;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return [SMS77Channel::class];
    }

    public function toSms77()
    {
        return (new SMS77Message($this->otp))
            ->to('01606587125')
            ->from('ABSTIMMUNG');
    }
}
