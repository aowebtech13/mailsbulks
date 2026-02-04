<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject }}</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.025em;
        }
        .content {
            padding: 40px;
            color: #334155;
            font-size: 16px;
            line-height: 1.7;
        }
        .content p {
            margin-bottom: 20px;
        }
        .footer {
            background-color: #f1f5f9;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #64748b;
        }
        .footer a {
            color: #4f46e5;
            text-decoration: none;
            font-weight: 600;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            background: #eef2ff;
            color: #4f46e5;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 16px;
        }
        .divider {
            height: 1px;
            background-color: #e2e8f0;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>{{ $subject }}</h1>
        </div>
        <div class="content">
            <span class="badge">Official Communication</span>
            {!! $body !!}
            <div class="divider"></div>
            <p style="font-size: 14px; color: #94a3b8;">
                This message was sent securely using our professional mailing system. If you did not expect this email, please ignore it.
            </p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} <strong>MailsBulk</strong>. All rights reserved.</p>
            <p>Designed for excellence | <a href="#">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>
