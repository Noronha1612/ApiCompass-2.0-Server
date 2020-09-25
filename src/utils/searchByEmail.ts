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

export default async function searchByEmail(email: string, ...request: string[]) {
    interface shapes {
        foo: string
    }

    const data = await db('users')
        .select(request)
        .where({ email })
        .first<userInterface | undefined>();

    if ( !data ) return { emailExist: false };

    return { emailExist: true, data }
}