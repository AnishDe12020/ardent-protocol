import axios from "axios"
import { getServerSession } from "next-auth"

import prisma from "@/lib/prisma"

export const POST = async (req: Request) => {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json()

  if (!body.name || !body.logo || !body.nftImage) {
    return new Response("Missing body fields", { status: 400 })
  }

  console.log(body)

  const res = await axios.post(
    "https://staging.crossmint.com/api/2022-06-09/collections",
    {
      chain: "solana",
      metadata: {
        name: body.name,
        imageUrl: body.logo,
        description: `NFT loyalty program for ${body.name}`,
      },
      reuploadLinkedFiles: false,
    },
    {
      headers: {
        "x-client-secret": process.env.CROSSMINT_KEY,
        "x-project-id": process.env.CROSSMINT_PROJECT_ID,
      },
    }
  )

  const collection = await prisma.org.create({
    data: {
      collectionId: res.data.id,
      name: body.name,
      logoUrl: body.logo,
      nftImage: body.nftImage,
      owner: {
        connect: {
          email: session.user.email,
        },
      },
    },
  })

  return new Response(JSON.stringify(collection), { status: 200 })
}
