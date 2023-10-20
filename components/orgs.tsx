import Link from "next/link"
import { Org } from "@prisma/client"
import { Table } from "lucide-react"

import { buttonVariants } from "./ui/button"
import { TableBody, TableHead, TableHeader, TableRow } from "./ui/table"

const Orgs = ({ orgs }: { orgs: Org[] }) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <Link href="/dashboard/new" className={buttonVariants()}>
          New Org
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto, minmax(300px, 300px))]">
        <div className="flex flex-col gap-4 bg-secondary rounded-xl p-4 w-[300px]">
          <img
            src="https://avatars.githubusercontent.com/u/1?s=200&v=4"
            className="w-68 h-68 rounded-lg"
          />

          <div className="flex gap-2 items-center">
            <img
              src="https://avatars.githubusercontent.com/u/1?s=200&v=4"
              className="w-10 h-10 rounded-lg"
            />
            <p className="text-xl font-bold">Hello org</p>
          </div>

          <Link className={buttonVariants()} href={`/dashboard/orgs/1`}>
            Manage
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Orgs
