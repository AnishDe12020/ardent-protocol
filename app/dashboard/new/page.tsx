"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Upload from "@/components/upload"

const createOrgFormSchema = z.object({
  name: z.string().min(3).max(50),
  logo: z.string().url(),
  nftImage: z.string().url(),
})

type CreateOrgFormSchema = z.infer<typeof createOrgFormSchema>

const NewOrgPage = () => {
  const form = useForm<CreateOrgFormSchema>({
    resolver: zodResolver(createOrgFormSchema),
  })

  const [isCreating, setIsCreating] = useState(false)

  const router = useRouter()

  const onSubmit = async (values: CreateOrgFormSchema) => {
    console.log(values)

    setIsCreating(true)

    try {
      const res = await axios.post("/api/batch", {
        name: values.name,
        logo: values.logo,
        nftImage: values.nftImage,
      })

      router.push(`/dashboard/orgs/${res.data.id}`)

      toast.success("Batch and vaccines created")
      setIsCreating(false)
    } catch (e) {
      setIsCreating(false)
      toast.error("Error creating batch")
      console.error(e)
    }
  }

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <Card className="w-[720px]">
        <CardHeader>
          <CardTitle>New Org</CardTitle>
          <CardDescription>Create a new org</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-6">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Internal batch identifier
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 justify-between">
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo</FormLabel>
                        <FormControl>
                          <Upload
                            onChange={field.onChange}
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          Logo of your organization
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nftImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NFT Image</FormLabel>
                        <FormControl>
                          <Upload
                            onChange={field.onChange}
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>Image of your NFT</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Button type="submit" isLoading={isCreating}>
                Create Org
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default NewOrgPage
