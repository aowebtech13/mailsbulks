<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;
use App\Mail\BulkMail;

class SendBulkEmailJob implements ShouldQueue
{
    use Queueable;

    public $recipient;
    public $mailData;
    public $smtpConfig;

    /**
     * Create a new job instance.
     */
    public function __construct($recipient, $mailData, $smtpConfig)
    {
        $this->recipient = $recipient;
        $this->mailData = $mailData;
        $this->smtpConfig = $smtpConfig;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Dynamically configure SMTP for this job process
        Config::set('mail.mailers.dynamic_smtp', $this->smtpConfig);
        Config::set('mail.default', 'dynamic_smtp');

        Mail::to($this->recipient)->send(new BulkMail($this->mailData));
    }
}
