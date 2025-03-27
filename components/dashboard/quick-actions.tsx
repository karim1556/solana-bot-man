import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Wallet, ArrowUpDown, Flame } from "lucide-react"
import Link from "next/link"

interface QuickActionsProps {
  className?: string
}

export function QuickActions({ className }: QuickActionsProps) {
  const actions = [
    {
      title: "Create Token",
      icon: PlusCircle,
      href: "/create",
      variant: "default" as const,
    },
    {
      title: "Connect Wallet",
      icon: Wallet,
      href: "/wallet",
      variant: "outline" as const,
    },
    {
      title: "Transfer Tokens",
      icon: ArrowUpDown,
      href: "/transfer",
      variant: "outline" as const,
    },
    {
      title: "Burn Tokens",
      icon: Flame,
      href: "/burn",
      variant: "outline" as const,
    },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common token operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {actions.map((action) => (
            <Button key={action.title} variant={action.variant} className="justify-start" asChild>
              <Link href={action.href}>
                <action.icon className="mr-2 h-4 w-4" />
                {action.title}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

