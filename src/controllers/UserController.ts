import { Request, Response } from 'express';
import crypto from 'crypto';

import db from '../database/connection';

import encryptPassword from '../utils/encryptPassword';
import generateToken from '../utils/generateToken';


export default class UserController {
    async index(request: Request, response: Response) {
        try {
            const { userId } = request.query;

            if ( !userId ) return response.status(400).json({ error: true, message: 'userId required on query' });

            const requestedFields = [
                'name',
                'email',
                'followers',
                'following',
                'score',
                'created_api_ids',
                'liked_api_ids'
            ];
            
            const user = await db('users')
                .select(requestedFields)
                .where({ id: userId })
                .first();

            if ( !user ) return response.status(404).json({ error: true, message: 'User not found' });

            return response.status(200).json({ error: false, data: [user] });
        } catch(err) {
            console.log(err);

            return response.status(500).json({ error: true, message: 'Internal server error' });
        }
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

            return response.status(200).json({ error: false, data: [{ token }] });
        } catch(err) {
            if ( err ) console.log(err);

            return response.status(500).json({ error: true, message: "Unexpected error" });
        }
    }

    async login(request: Request, response: Response) {
        try {
            const { email, password } = request.body;

            const encryptedPassword = encryptPassword(password);

            const user = await db('users')
                .select(['id', 'password'])
                .where({ email })
                .first<{ id: string, password: string } | undefined>();

            if ( !user ) 
                return response.status(404).json({ error: true, message: 'Email has not been registered' });

            if ( encryptedPassword !== user.password ) 
                return response.status(401).json({ error: true, message: 'Wrong password' });

            const token = generateToken({ userId: user.id });

            return response.status(200).json({ error: false, data: [{ token }] });
        }
        catch(err) {
            if ( err ) console.log(err);
        }
    }
}
