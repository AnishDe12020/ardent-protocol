import { NextRequest } from "next/server"
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import prisma from "@/lib/prisma"

export const options = (req: NextRequest): NextAuthOptions => {
  return {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    events: {
      signIn: async (message) => {
        console.log(message)

        const user = await prisma.user.findUnique({
          where: {
            email: message.user.email as string,
          },
        })

        if (!user) {
          await prisma.user.create({
            data: {
              email: message.user.email as string,
            },
          })
        }
      },
    },
  }
}
