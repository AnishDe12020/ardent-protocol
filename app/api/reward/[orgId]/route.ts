import { getServerSession } from "next-auth"

import prisma from "@/lib/prisma"

export const GET = async (
  _: Request,
  {
    params: { orgId },
  }: {
    params: {
      orgId: string
    }
  }
) => {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 })
  }

  const org = await prisma.org.findUnique({
    where: {
      id: Number(orgId),
    },
    include: {
      nfts: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!org) {
    return new Response("Org not found", { status: 404 })
  }

  const userNFT = org.nfts.find(
    (nft) => nft.user.email === session?.user?.email
  )

  return new Response(JSON.stringify({ org, userNFT: userNFT ?? null }), {
    status: 200,
  })
}
