import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export const getSession = async () => getServerSession(authOptions)
