'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../configs/nextAuthConfig';

export const getSession = async () => getServerSession(authOptions);
