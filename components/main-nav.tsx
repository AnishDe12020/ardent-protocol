import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavItem } from "@/types/nav"
import { cn } from "@/lib/utils"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname()

  return (
    <div className="flex gap-6 md:gap-10 rounded-full py-2 px-2 bg-secondary shadow-md">
      {items?.length ? (
        <nav className="flex gap-1">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-tertiary transition duration-150",
                    pathname === item.href ? "bg-primary text-black" : "null",
                    pathname.includes("dashboard") && item.href === "/dashboard"
                      ? "bg-primary text-black"
                      : null,
                    pathname.includes("demo") && item.href === "/demo"
                      ? "bg-primary text-black"
                      : null
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
