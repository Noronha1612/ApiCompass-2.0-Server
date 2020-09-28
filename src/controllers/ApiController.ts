import { Request, Response } from 'express';
import Knex from 'knex';
import db from '../database/connection';

import searchById from '../utils/searchById';

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

    async create(request: Request, response: Response) {
        try {
            const { creatorid: creatorId } = request.headers as { creatorid: string };

            const creator = await searchById(creatorId, 'id', 'created_api_ids');
            if ( !creator.userExist ) return response.status(403).json({ error: true, message: 'Invalid user ID' });

            const dataBody = request.body as {
                apiName: string,
                description: string,
                documentationUrl?: string,
                mainUrl: string
            };

            const data = {
                ...dataBody,
                views: 0,
                likes: 0,
                creator_id: creator.data?.id
            }

            const createdApiId = await db('apis')
                .insert<string>(data);

            const apiIds = creator.data?.created_api_ids?.split(',').filter(id => !!id);

            apiIds?.push(createdApiId[0]);

            await db('users')
                .update({ created_api_ids: apiIds?.join(',') })
                .where({ id: creatorId });

            return response.status(200).json({ error: false, data: [{ creatorId, apiId: createdApiId }]});
        } catch(err) {
            console.log(err);
            return response.status(500).json({ error: true, message: 'Internal Server Error' });
        }
    }
}
