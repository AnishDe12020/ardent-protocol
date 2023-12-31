"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"

const PROJECT_ID = 1

const DemoPage = () => {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const [isBuying, setIsBuying] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["points"],
    queryFn: async () => {
      const res = await axios.get(`/api/reward/${PROJECT_ID}`)
      return res.data
    },
  })

  const { data: nftData, isLoading: isNFTLoading } = useQuery({
    queryKey: ["nft"],
    queryFn: async () => {
      const status = await axios.get(
        `https://staging.crossmint.com/api/2022-06-09/collections/${data.org.collectionId}/nfts/${data.userNFT.nftId}`,
        {
          headers: {
            "x-client-secret": process.env.NEXT_PUBLIC_CROSSMINT_KEY,
            "x-project-id": process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID,
          },
        }
      )

      return status.data
    },
    enabled: !!data?.userNFT?.nftId,
    refetchInterval: 1000,
  })

  console.log(nftData)

  return (
    <div className="container max-w-5xl mt-16 h-full w-full">
      <h1 className="text-4xl font-bold">Demo Page</h1>

      <p className="mt-2">
        We simulate a loyalty reward system where one buys a coffee to get 1
        loyaly point
      </p>

      <ul className="mt-4">
        <p className="font-bold mb-1 text-xl">Tiers:</p>
        <li>50 points: Diaomond</li>
        <li>25 points: Platinum</li>
        <li>10 points: Gold</li>
        <li>5 points: Silver</li>
        <li>1 point: Bronze</li>
      </ul>

      <div className="flex flex-col mt-8 max-w-2xl">
        <Button
          className="mb-4 w-fit"
          onClick={async () => {
            setIsBuying(true)
            await axios.post("/api/reward", {
              email: session?.user?.email,
              orgId: PROJECT_ID,
            })

            await queryClient.refetchQueries({
              queryKey: ["points"],
            })
            toast.success("Bought coffee")
            setIsBuying(false)
          }}
          isLoading={isBuying}
        >
          Buy Coffee
        </Button>
        <p>Points: {data?.userNFT?.points ?? 0}</p>
        {!isLoading && !isNFTLoading && data?.userNFT && (
          <>
            {nftData ? (
              <a
                href={`https://solscan.io/token/${nftData.onChain.mintHash}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ className: "mt-4 w-fit" })}
              >
                View NFT on Solscan
              </a>
            ) : (
              <p>Minting...</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default DemoPage
