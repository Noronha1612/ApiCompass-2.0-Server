import { Request, Response } from 'express';
import db from '../database/connection';

export default class ApiController {
    async index(request: Request, response: Response) {
        const apis = await db('apis').select('*');

        return response.status(200).json({ status: 200, response: apis });
    }
}
