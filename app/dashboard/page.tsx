import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import prisma from "@/lib/prisma"
import Orgs from "@/components/orgs"

const DashboardPage = async () => {
  const session = await getServerSession()

  const orgs = await prisma.org.findMany({
    where: {
      owner: {
        email: session?.user?.email as string,
      },
    },
  })

  console.log(orgs)

  return orgs && <Orgs orgs={orgs} />
}

export default DashboardPage
