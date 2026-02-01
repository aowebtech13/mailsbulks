import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Use automatic configuration from Environment Variables
    const {
        SMTP_HOST,
        SMTP_PORT,
        SMTP_USER,
        SMTP_PASS,
        SMTP_ENCRYPTION,
        SMTP_FROM_EMAIL
    } = process.env;

    const {
        recipients,
        subject,
        body,
        from_email,
        headers_list
    } = req.body;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !recipients || !subject || !body) {
        return res.status(400).json({ message: 'Missing required configuration or fields' });
    }

    // Configure transporter
    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT || '587'),
        secure: SMTP_ENCRYPTION === 'ssl',
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
        tls: {
            // Do not fail on invalid certs (useful for some spoofing/educational scenarios)
            rejectUnauthorized: false
        }
    });

    const results = {
        success: 0,
        failed: 0,
        errors: []
    };

    // Prepare custom headers
    const customHeaders = {};
    if (headers_list && Array.isArray(headers_list)) {
        headers_list.forEach(h => {
            if (h.name && h.value) {
                customHeaders[h.name] = h.value;
            }
        });
    }

    // Send emails
    const sendPromises = recipients.map(async (recipient) => {
        try {
            await transporter.sendMail({
                from: from_email || SMTP_FROM_EMAIL || SMTP_USER,
                to: recipient,
                subject: subject,
                html: body,
                headers: customHeaders
            });
            results.success++;
        } catch (error) {
            results.failed++;
            results.errors.push({ recipient, error: error.message });
        }
    });

    await Promise.all(sendPromises);

    return res.status(200).json({
        message: 'Bulk mailing process completed',
        results
    });
}
