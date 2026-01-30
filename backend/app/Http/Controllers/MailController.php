<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\BulkMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;
use App\Jobs\SendBulkEmailJob;

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

        $headers = [];
        if ($request->has('headers_list')) {
            foreach ($request->headers_list as $h) {
                if (!empty($h['name']) && !empty($h['value'])) {
                    $headers[$h['name']] = $h['value'];
                }
            }
        }

        foreach ($request->recipients as $recipient) {
            $mailData = [
                'subject' => $request->subject,
                'body' => $request->body,
                'from' => $request->from_email ?? $request->smtp_user,
                'headers' => $headers
            ];

            // Dispatch to queue for efficiency
            SendBulkEmailJob::dispatch($recipient, $mailData, $smtpConfig);
        }

        return response()->json([
            'message' => 'Email sending process started. All emails have been queued.',
            'count' => count($request->recipients)
        ]);
    }
}
