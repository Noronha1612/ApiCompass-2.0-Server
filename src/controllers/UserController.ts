import { Request, Response } from 'express';
import crypto from 'crypto';

import db from '../database/connection';

import encryptItem from '../utils/encryptItem';
import generateToken from '../utils/generateToken';
import searchByEmail from '../utils/searchByEmail';
import searchById from '../utils/searchById';
import sendMail from '../services/sendMail';


export default class UserController {
    async index(request: Request, response: Response) {
        try {
            const { id: userId } = request.params as { id: string | undefined };

            if ( !userId ) return response.status(400).json({ error: true, message: 'userId required' });

            console.log(userId);

            const requestedFields = [
                'name',
                'email',
                'followers',
                'following',
                'score',
                'created_api_ids',
                'liked_api_ids'
            ];
            
            const user = await searchById(userId, ...requestedFields);

            if ( !user.userExist ) return response.status(404).json({ error: true, message: 'User not found' });

            return response.status(200).json({ error: false, data: [user.data] });
        } catch(err) {
            console.log(err);

            return response.status(500).json({ error: true, message: 'Internal server error' });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const { name, email, password, confirmPassword } = request.body;

            const searchEmailResponse = await searchByEmail(email, 'email');

            const nameAlreadyExist = await db('users')
            .select('name')
            .where({ name })
            .first();

            if ( searchEmailResponse.emailExist ) return response.status(409).json({ error: true, message: 'email already exist' });
            if ( nameAlreadyExist ) return response.status(409).json({ error: true, message: 'name already exist' });

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

            const encryptedPassword = encryptItem(password);

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

            const encryptedPassword = encryptItem(password);

            const emailSearchResponse = await searchByEmail(email, 'id', 'password');

            if ( !emailSearchResponse.emailExist ) 
                return response.status(404).json({ error: true, message: 'Email has not been registered' });

            if ( encryptedPassword !== emailSearchResponse.data?.password as string) 
                return response.status(401).json({ error: true, message: 'Wrong password' });

            const token = generateToken({ userId: emailSearchResponse.data?.id });

            return response.status(200).json({ error: false, data: [{ token }] });
        }
        catch(err) {
            if ( err ) console.log(err);
        }
    }

    async sendCode(request: Request, response: Response) {
        try {
            const { userEmail } = request.query as { userEmail: string };

            const { emailExist, ...searchResponse } = await searchByEmail(userEmail, 'email');

            if ( !emailExist ) return response.status(404).json({ error: true, message: 'Email not found' });

            const authCode: number[] = [];
            for ( let ind = 0; ind < 6; ind++ ) authCode.push(Math.floor(Math.random() * 10));

            const filteredAuthCode = authCode.map((number, ind) => {
                if ( number == 10 ) authCode[ind] = Math.floor(Math.random() * 10);

                return number;
            });

            sendMail(userEmail, authCode);

            const encryptedCode = encryptItem(filteredAuthCode.join(''));

            const payload = {
                email: userEmail,
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                encryptedCode
            };

            const token = generateToken(payload);

            return response.status(200).json({ error: false, data: [{ token }] });
        } catch ( err ) {
            console.log(err);

            return response.status(500).json({ error: true, message: 'Internal Server Error' });
        }
    }
}
