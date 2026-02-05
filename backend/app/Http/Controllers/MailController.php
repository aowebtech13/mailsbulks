<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\BulkMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;
use App\Jobs\SendBulkEmailJob;

use App\Models\SentEmail;

class MailController extends Controller
{
    public function sendBulk(Request $request)
    {
        $request->validate([
            'recipients' => 'required|array',
            'subject' => 'required',
            'body' => 'required',
        ]);

        $smtpConfig = null;
        if ($request->has('smtp_host') && $request->smtp_host) {
            $smtpConfig = [
                'transport' => 'smtp',
                'host' => $request->smtp_host,
                'port' => $request->smtp_port,
                'encryption' => $request->smtp_encryption ?? 'tls',
                'username' => $request->smtp_user,
                'password' => $request->smtp_pass,
                'timeout' => null,
                'local_domain' => env('MAIL_EHLO_DOMAIN'),
            ];
        }

        $headers = [];
        if ($request->has('headers_list')) {
            foreach ($request->headers_list as $h) {
                if (!empty($h['name']) && !empty($h['value'])) {
                    $headers[$h['name']] = $h['value'];
                }
            }
        }

        foreach ($request->recipients as $recipient) {
            $sentEmail = SentEmail::create([
                'from_email' => $request->from_email ?? config('mail.from.address'),
                'recipient' => $recipient,
                'subject' => $request->subject,
                'body' => $request->body,
                'status' => 'queued',
            ]);

            $mailData = [
                'subject' => $request->subject,
                'body' => $request->body,
                'from' => $request->from_email ?? config('mail.from.address'),
                'headers' => $headers,
                'id' => $sentEmail->id
            ];

            // Send immediately without background queue
            SendBulkEmailJob::dispatchSync($recipient, $mailData, $smtpConfig);
        }

        return response()->json([
            'message' => 'Email sending process started. All emails have been queued.',
            'count' => count($request->recipients)
        ]);
    }

    public function history()
    {
        $history = SentEmail::orderBy('created_at', 'desc')->get();
        return response()->json($history);
    }
}
