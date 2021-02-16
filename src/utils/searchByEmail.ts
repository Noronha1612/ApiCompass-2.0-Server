import db from '../database/connection';

interface UserInterface {
    id: string;
    name: string;
    email: string;
    password: string;
    created_api_ids: string;
    liked_api_ids: string;
    followers: string;
    following: string;
    score: number;
}

export default async function searchByEmail<T extends keyof UserInterface>(email: string, ...request: T[]) {
    type requestResponse = Pick<UserInterface, T>

    const data = await db('users')
        .select(request)
        .where({ email })
        .first<requestResponse | undefined>();

    if ( !data ) return { emailExist: false };

    return { emailExist: true, data }
}