import { Request, Response } from 'express';
import db from '../database/connection';

interface IApi {
    id: number;
    apiName: string;
    description: string;
    mainUrl: string;
    documentationUrl: string;
    creator_id: string;
    views: number;
    likes: number;
}

export default class ApiController {
    async index(request: Request, response: Response) {
        try {
            const { apiids: apiIds } = request.headers as { apiids: string };
            
            if ( !apiIds ) return response.status(400).json({ error: true, message: 'Missing API Ids' });

            const ids = apiIds.split(',');

            const apisPromises = ids.map(id => {
                const api = db('apis')
                    .select('*')
                    .where({ id })
                    .first<IApi>();

                return api;
            });

            const apis = await Promise.all(apisPromises);

            const cleanApis = apis.filter(api => !!api);

            return response.status(200).json({ error: false, data: cleanApis});
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error: true, message: 'Internal Server Error' });
        }
    }

    async indexAllApis(request: Request, response: Response) {
        try {
            const apis = await db('apis').select('*');

            return response.status(200).json({ error: false, data: apis });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error: true, message: 'Internal Server Error' });
        }
    }

}
