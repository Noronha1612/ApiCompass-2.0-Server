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
}
