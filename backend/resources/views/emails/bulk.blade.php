<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f1f5f9;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f1f5f9;
            padding-bottom: 60px;
        }
        .main {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-spacing: 0;
            color: #1e293b;
            border-radius: 24px;
            overflow: hidden;
            margin-top: 40px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
            padding: 50px 40px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.05em;
            line-height: 1.2;
        }
        .content {
            padding: 48px 40px;
            background-color: #ffffff;
        }
        .content-body {
            font-size: 16px;
            line-height: 1.8;
            color: #334155;
        }
        .content-body p {
            margin-bottom: 24px;
        }
        .badge {
            display: inline-block;
            padding: 6px 16px;
            background: #e0f2fe;
            color: #0369a1;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            margin-bottom: 24px;
        }
        .divider {
            height: 1px;
            background-color: #f1f5f9;
            margin: 32px 0;
        }
        .footer {
            padding: 40px;
            text-align: center;
            background-color: #f8fafc;
            border-top: 1px solid #f1f5f9;
        }
        .footer p {
            font-size: 14px;
            color: #64748b;
            margin: 8px 0;
        }
        .footer a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 600;
        }
        .brand {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 16px !important;
        }
        .security-notice {
            font-size: 12px !important;
            color: #94a3b8 !important;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <table class="main" width="100%">
            <tr>
                <td>
                    <div class="header">
                        <h1>{{ $subject }}</h1>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <span class="badge">Verified Transmission</span>
                    <div class="content-body">
                        {!! $body !!}
                    </div>
                    <div class="divider"></div>
                    <p class="security-notice">
                        <strong>Security Note:</strong> This communication was encrypted and delivered via our secure enterprise relay. If you are not the intended recipient, please notify the sender and delete this message.
                    </p>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p class="brand">MailsBulk Enterprise</p>
                    <p>&copy; {{ date('Y') }} MailsBulk. All rights reserved.</p>
                    <p>
                        <a href="#">Security Center</a> &nbsp;|&nbsp; 
                        <a href="#">Privacy Policy</a> &nbsp;|&nbsp; 
                        <a href="#">Unsubscribe</a>
                    </p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
