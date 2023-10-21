"use client"

import Link from "next/link"
import { signIn, useSession } from "next-auth/react"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  const { data: session } = useSession()

  console.log(session)

  return (
    <div className="flex flex-col items-center min-h-screen py-2">
      <section className="div flex gap-32 justify-between max-w-5xl mt-16">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            NFT Loyalty program on Solana
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Ardent protocol is a loyalty program that allows you to reward your
            customers with NFTs which can futher unlock benefits like discounts,
            access to exclusive events and more.
          </p>
        </div>

        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS34pAB6ZmuEXmBsJfXvFpybztoWG4XtpcvrpQdRyEj4zLXaEZAT9Q2_yPavI4sqlOJKys&usqp=CAU" />
      </section>
    </div>
  )
}
