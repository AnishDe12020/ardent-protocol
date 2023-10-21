import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"

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
  })

  console.log(org)

  if (!org) {
    notFound()
  }

  return (
    <>
      <div className="flex gap-4 items-center">
        <img src={org.logoUrl} className="w-10 h-10 rounded-lg" />
        <h1>{org.name}</h1>
      </div>
    </>
  )
}

export default OrgPage
