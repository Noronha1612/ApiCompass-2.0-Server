import crypto from 'crypto';
import { config } from 'dotenv';

config();

export default function encryptPassword(password: string) {
    const passwordKey = process.env.passwordKey as string;
    const iv = process.env.passwordIv as string;

    const key = crypto.scryptSync(passwordKey, 'salt', 32);

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    const encryptedPass = cipher.update(password, 'utf8', 'hex');

    return encryptedPass;
};