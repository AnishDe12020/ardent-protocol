import axios from "axios"

import prisma from "@/lib/prisma"
import { getTier } from "@/lib/tiers"

export const POST = async (req: Request) => {
  const body = await req.json()

  if (!body.email || !body.orgId) {
    return new Response("Missing body fields", { status: 400 })
  }

  const org = await prisma.org.findUnique({
    where: {
      id: body.orgId,
    },
  })

  if (!org) {
    return new Response("Org not found", { status: 404 })
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  })

  if (!user) {
    await prisma.user.create({
      data: {
        email: body.email,
        avatar: `https://avatars.dicebear.com/api/avataaars/${body.email}.svg`,
      },
    })
  }

  const existingNft = await prisma.nft.findFirst({
    where: {
      user: {
        email: body.email,
      },
      orgId: body.orgId,
    },
  })

  if (existingNft) {
    await axios.patch(
      `https://staging.crossmint.com/api/2022-06-09/collections/${org.collectionId}/nfts/${existingNft.nftId}`,
      {
        reUploadLinkedFiles: false,
        metadata: {
          name: `${org.name} Loyalist NFT - ${getTier(existingNft.points + 1)}`,
          image: org.nftImage,
          description: `NFT loyalty program for ${org.name}`,
          attributes: [
            {
              display_type: "number",
              trait_type: "Points",
              value: (existingNft.points + 1).toString(),
            },
            {
              trait_type: "Tier",
              value: getTier(existingNft.points + 1),
            },
          ],
        },
      },
      {
        headers: {
          "x-client-secret": process.env.NEXT_PUBLIC_CROSSMINT_KEY,
          "x-project-id": process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID,
        },
      }
    )

    const nft = await prisma.nft.update({
      where: {
        id: existingNft.id,
      },
      data: {
        tier: getTier(existingNft.points),
        points: existingNft.points + 1,
      },
    })

    return new Response(JSON.stringify(nft), { status: 200 })
  }

  let tokenAddress

  const res = await axios.post(
    `https://staging.crossmint.com/api/2022-06-09/collections/${org.collectionId}/nfts`,
    {
      recipient: `email:${body.email}:solana`,
      compressed: false,
      reuploadLinkedFiles: false,
      metadata: {
        name: `${org.name} Loyalist NFT - BRONZE`,
        image: org.nftImage,
        description: `NFT loyalty program for ${org.name}`,
        attributes: [
          {
            display_type: "number",
            trait_type: "Points",
            value: "1",
          },
          {
            trait_type: "Tier",
            value: getTier(1),
          },
        ],
      },
    },
    {
      headers: {
        "x-client-secret": process.env.NEXT_PUBLIC_CROSSMINT_KEY,
        "x-project-id": process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID,
      },
    }
  )
  const nft = await prisma.nft.create({
    data: {
      nftId: res.data.id,
      points: 1,
      tier: getTier(1),
      user: {
        connect: {
          email: body.email,
        },
      },
      org: {
        connect: {
          id: body.orgId,
        },
      },
    },
  })

  return new Response(JSON.stringify(nft), { status: 200 })
}
