import { getServerSession, type Session } from 'next-auth'
import { adminAuthOptions } from './authAdmin'

const auth = async (): Promise<Session | null> =>
  await getServerSession(adminAuthOptions)

export default auth
