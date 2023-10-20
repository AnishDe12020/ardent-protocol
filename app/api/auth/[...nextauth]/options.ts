import { NextRequest } from "next/server"
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const options = (req: NextRequest): NextAuthOptions => {
  return {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    events: {
      signIn: (message) => {
        console.log(message)
      },
    },
  }
}
