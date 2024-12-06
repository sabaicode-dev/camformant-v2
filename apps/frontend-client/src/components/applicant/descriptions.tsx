import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Descriptions } from "@/utils/types/user-profile"

interface DescriptionsProps {
  descriptions?: Descriptions
}

export function DescriptionsSection({ descriptions }: DescriptionsProps) {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{descriptions?.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{descriptions?.strength}</p>
        </CardContent>
      </Card>
    </div>
  )
}