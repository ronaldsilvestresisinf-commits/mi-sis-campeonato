import { SessionOptions } from 'iron-session'
import { Role } from '@prisma/client'

export interface SessionData {
  user?: {
    id: string
    username: string
    role: Role
  }
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: 'campeonato-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
}
