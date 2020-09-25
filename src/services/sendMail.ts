import { createTransport } from 'nodemailer';
import { config } from 'dotenv';

config();

export default function SendEmail(email: string, authCode: number[]) {
    const transporter = createTransport({
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: { rejectUnauthorized: false }
    });

    transporter.sendMail({
        sender: 'API Compass Support',
        from: 'apicompass@support.com',
        to: email,
        subject: 'API Compass Code',
        html: `<h4 style="font-family: sans-serif">Your auth code: <strong>${authCode.join(' ')}</strong></h4>`
    });
}