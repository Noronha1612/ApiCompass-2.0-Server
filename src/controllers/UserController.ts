import { Request, Response } from 'express';
import crypto from 'crypto';

import db from '../database/connection';

import encryptPassword from '../utils/encryptPassword';
import generateToken from '../utils/generateToken';


export default class UserController {
    async index(request: Request, response: Response) {
        const users = await db('users').select('*');

        return response.status(200).json({ status: 200, response: users });
    }

    async create(request: Request, response: Response) {
        try {
            const { name, email, password, confirmPassword } = request.body;

            let userId;

            while(true) {
                userId = crypto.randomBytes(6).toString('hex');

                const idAlreadyExist = await db<{ id?: string }>('users')
                    .select('id')
                    .where({ id: userId })
                    .first();

                if ( !idAlreadyExist?.id ) break;
            }

            if ( password !== confirmPassword ) 
                return response.status(403).json({ error: true, message: "Passwords don't match" });

            const encryptedPassword = encryptPassword(password);

            const data = {
                id: userId,
                name,
                email,
                password: encryptedPassword,
                created_api_ids: '',
                liked_api_ids: '',
                followers: '',
                following: '',
                score: 0
            };

            await db('users').insert(data);

            const token = generateToken({ userId });

            return response.status(200).json({ error: false, token });
        } catch(err) {
            if ( err ) console.log(err);

            return response.status(500).json({ error: true, message: "Unexpected error" });
        }
    }
}
