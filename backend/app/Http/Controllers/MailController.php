<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\BulkMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;

class MailController extends Controller
{
    public function sendBulk(Request $request)
    {
        $request->validate([
            'smtp_host' => 'required',
            'smtp_port' => 'required',
            'smtp_user' => 'required',
            'smtp_pass' => 'required',
            'recipients' => 'required|array',
            'subject' => 'required',
            'body' => 'required',
        ]);

        // Configure mailer dynamically
        Config::set('mail.mailers.dynamic_smtp', [
            'transport' => 'smtp',
            'host' => $request->smtp_host,
            'port' => $request->smtp_port,
            'encryption' => $request->smtp_encryption ?? 'tls',
            'username' => $request->smtp_user,
            'password' => $request->smtp_pass,
            'timeout' => null,
            'local_domain' => env('MAIL_EHLO_DOMAIN'),
        ]);

        Config::set('mail.default', 'dynamic_smtp');

        $headers = [];
        if ($request->has('headers_list')) {
            foreach ($request->headers_list as $h) {
                if (!empty($h['name']) && !empty($h['value'])) {
                    $headers[$h['name']] = $h['value'];
                }
            }
        }

        $results = [];
        foreach ($request->recipients as $recipient) {
            try {
                // Educational note: Spoofing is achieved by setting a 'from' address 
                // different from the authenticated SMTP user. 
                // Many SMTP servers will reject this or add a 'Sender' header.
                $mailData = [
                    'subject' => $request->subject,
                    'body' => $request->body,
                    'from' => $request->from_email ?? $request->smtp_user,
                    'headers' => $headers
                ];

                // Educational note: To "bypass" some security filters (like rate limiting), 
                // developers often implement delays (sleep) or rotate between multiple 
                // SMTP servers. This project demonstrated dynamic configuration.
                // sleep(1); // Basic rate limiting bypass technique
                
                Mail::to($recipient)->send(new BulkMail($mailData));
                
                $results[] = ['email' => $recipient, 'status' => 'success'];
            } catch (\Exception $e) {
                $results[] = ['email' => $recipient, 'status' => 'failed', 'error' => $e->getMessage()];
            }
        }

        return response()->json(['results' => $results]);
    }
}
