import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export default function generateToken(payload: {}) {
    const tokenKey = process.env.tokenKey as string;

    const token = jwt.sign(payload, tokenKey);

    return token;
};