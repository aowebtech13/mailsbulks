<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;
use App\Mail\BulkMail;

use App\Models\SentEmail;

class SendBulkEmailJob implements ShouldQueue
{
    use Queueable;

    public $recipient;
    public $mailData;
    public $smtpConfig;

    /**
     * Create a new job instance.
     */
    public function __construct($recipient, $mailData, $smtpConfig = null)
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
        $sentEmail = SentEmail::find($this->mailData['id']);

        try {
            if ($this->smtpConfig) {
                // Dynamically configure SMTP for this job process
                Config::set('mail.mailers.dynamic_smtp', $this->smtpConfig);
                Config::set('mail.default', 'dynamic_smtp');
            }

            Mail::to($this->recipient)->send(new BulkMail($this->mailData));

            if ($sentEmail) {
                $sentEmail->update(['status' => 'sent']);
            }
        } catch (\Exception $e) {
            if ($sentEmail) {
                $sentEmail->update([
                    'status' => 'failed',
                    'error' => $e->getMessage()
                ]);
            }
            throw $e;
        }
    }
}
