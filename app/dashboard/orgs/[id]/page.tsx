import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const OrgPage = async ({
  params: { id },
}: {
  params: {
    id: string
  }
}) => {
  const org = await prisma.org.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      nfts: {
        include: {
          user: true,
        },
      },
    },
  })

  console.log(org)

  if (!org) {
    notFound()
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex gap-4 items-center">
          <img src={org.logoUrl} className="w-10 h-10 rounded-lg" />
          <h1>{org.name}</h1>
        </div>
        <div className="flex flex-col gap-4">
          {org.nfts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Tier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {org.nfts.map((nft) => (
                  <TableRow>
                    <TableCell>{nft.user.email}</TableCell>
                    <TableCell>{nft.points}</TableCell>
                    <TableCell>{nft.tier}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No NFTs rewarded yet</p>
          )}
        </div>
      </div>
    </>
  )
}

export default OrgPage
