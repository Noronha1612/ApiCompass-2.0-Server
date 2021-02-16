import db from '../database/connection';

import { UserInterface } from '../types';

export default async function searchById<T extends keyof UserInterface>(userId: string, ...request: T[]) {
    type requestResponse = Pick<UserInterface, T>

    const data = await db('users')
        .select(request)
        .where({ id: userId })
        .first<requestResponse | undefined>();

    if ( !data ) return { userExist: false };

    return { userExist: true, data }
}