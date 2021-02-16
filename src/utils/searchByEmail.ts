import db from '../database/connection';

import { UserInterface } from '../types';

export default async function searchByEmail<T extends keyof UserInterface>(email: string, ...request: T[]) {
    type requestResponse = Pick<UserInterface, T>

    const data = await db('users')
        .select(request)
        .where({ email })
        .first<requestResponse | undefined>();

    if ( !data ) return { emailExist: false };

    return { emailExist: true, data }
}