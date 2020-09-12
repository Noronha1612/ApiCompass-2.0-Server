import crypto from 'crypto';
import { config } from 'dotenv';

config();

export default function encryptPassword(password: string) {
    const passwordKey = process.env.passwordKey as string;

    const cypher = crypto.createCipheriv('aes-256-gcm', passwordKey, null);

    const encryptedPass = cypher.update(password, 'utf8', 'hex');

    return encryptPassword;
};