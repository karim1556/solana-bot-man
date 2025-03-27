"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"

const tokenFormSchema = z.object({
  name: z.string().min(2, {
    message: "Token name must be at least 2 characters.",
  }),
  symbol: z
    .string()
    .min(1, {
      message: "Token symbol is required.",
    })
    .max(10, {
      message: "Token symbol must not exceed 10 characters.",
    }),
  description: z.string().optional(),
  initialSupply: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Initial supply must be a positive number.",
  }),
  decimals: z.number().min(0).max(9),
  isMintable: z.boolean().default(false),
  isBurnable: z.boolean().default(false),
  isPausable: z.boolean().default(false),
})

type TokenFormValues = z.infer<typeof tokenFormSchema>

export default function CreateTokenPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: Partial<TokenFormValues> = {
    name: "",
    symbol: "",
    description: "",
    initialSupply: "1000000",
    decimals: 9,
    isMintable: true,
    isBurnable: true,
    isPausable: false,
  }

  const form = useForm<TokenFormValues>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues,
  })

  async function onSubmit(data: TokenFormValues) {
    setIsSubmitting(true)

    try {
      // Simulate token creation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Token Created Successfully",
        description: `${data.name} (${data.symbol}) has been created on the Solana blockchain.`,
      })

      // Reset form
      form.reset(defaultValues)
    } catch (error) {
      toast({
        title: "Error Creating Token",
        description: "There was an error creating your token. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Create Token" text="Create a new token on the Solana blockchain." />

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Configuration</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Token Information</CardTitle>
                  <CardDescription>Enter the basic details for your new Solana token.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Awesome Token" {...field} />
                        </FormControl>
                        <FormDescription>The full name of your token (e.g., "Solana")</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Symbol</FormLabel>
                        <FormControl>
                          <Input placeholder="MAT" {...field} />
                        </FormControl>
                        <FormDescription>The ticker symbol for your token (e.g., "SOL")</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="A brief description of your token and its purpose" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="initialSupply"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Supply</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>The initial amount of tokens to create</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Configuration</CardTitle>
                  <CardDescription>Configure advanced options for your token.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="decimals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Decimals: {field.value}</FormLabel>
                        <FormControl>
                          <Slider
                            min={0}
                            max={9}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormDescription>Number of decimal places (0-9)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="isMintable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Mintable</FormLabel>
                            <FormDescription>Allow creating additional tokens in the future</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isBurnable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Burnable</FormLabel>
                            <FormDescription>
                              Allow tokens to be burned (permanently removed from circulation)
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isPausable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Pausable</FormLabel>
                            <FormDescription>Allow pausing all token transfers in case of emergency</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="mt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating Token..." : "Create Token"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </DashboardShell>
  )
}

