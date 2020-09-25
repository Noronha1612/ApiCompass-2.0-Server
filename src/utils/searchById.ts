import db from '../database/connection';

interface userInterface {
    id?: string;
    name?: string;
    email?: string;
    password?: string;
    created_api_ids?: string;
    liked_api_ids?: string;
    followers?: string;
    following?: string;
    score?: number;
}

export default async function searchById(userId: string, ...request: string[]) {

    const data = await db('users')
        .select(request)
        .where({ id: userId })
        .first<userInterface | undefined>();

    if ( !data ) return { userExist: false };

    return { userExist: true, data }
}