import { type Request } from 'express'

export default function getJwtToken (req: Request): string | null {
  return req.headers.authorization?.split(' ')[1] ?? null
}
