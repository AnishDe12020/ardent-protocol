import { NextRequest, NextResponse } from "next/server"
import NextAuth from "next-auth"

import { options } from "./options"

const handler = async (req: NextRequest, res: NextResponse) => {
  return NextAuth(req as any, res as any, options())
}

export { handler as GET, handler as POST }
