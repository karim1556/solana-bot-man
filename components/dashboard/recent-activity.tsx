import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RecentActivityProps {
  className?: string
}

export function RecentActivity({ className }: RecentActivityProps) {
  const activities = [
    {
      id: 1,
      type: "Token Creation",
      name: "SOLDEV",
      time: "2 hours ago",
      status: "success",
      icon: "SD",
    },
    {
      id: 2,
      type: "Token Transfer",
      name: "LUNA",
      time: "5 hours ago",
      status: "success",
      icon: "LN",
    },
    {
      id: 3,
      type: "Mint Tokens",
      name: "SOLDEV",
      time: "1 day ago",
      status: "success",
      icon: "SD",
    },
    {
      id: 4,
      type: "Burn Tokens",
      name: "GALAXY",
      time: "2 days ago",
      status: "success",
      icon: "GX",
    },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your recent token operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={activity.name} />
                <AvatarFallback>{activity.icon}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.type}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.name} • {activity.time}
                </p>
              </div>
              <div className={`text-xs font-medium ${activity.status === "success" ? "text-green-500" : "text-red-500"}`}>
                {activity.status === "success" ? "Completed" : "Failed"}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

