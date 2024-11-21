import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { day: "02", desktop: 1800, mobile: 1200 },
  { day: "03", desktop: 1900, mobile: 1300 },
  { day: "04", desktop: 2000, mobile: 1350 },
  { day: "05", desktop: 2200, mobile: 1500 },
  { day: "06", desktop: 2500, mobile: 1600 },
  { day: "07", desktop: 2600, mobile: 1700 },
  { day: "08", desktop: 2700, mobile: 1800 },
  { day: "09", desktop: 2800, mobile: 1900 },
  { day: "10", desktop: 2900, mobile: 1950 },
  { day: "11", desktop: 3000, mobile: 2000 },
  { day: "12", desktop: 3200, mobile: 2200 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#f97316", // Orange color for desktop
  },
  mobile: {
    label: "Mobile",
    color: "#f97316", // Orange color for mobile
  },
};

function ChartComponent() {
  return (
    <div className=" h-[370px]">
      <Card className="w-full h-full">
        {/* Content with flexible height */}
        <CardContent className="w-full h-5/6 ">
          <ChartContainer config={chartConfig}>
            <div className="w-full">
              <AreaChart
                width={600}
                height={250}
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="2 2" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} 
                tickFormatter={(value:any)=>`${value/100}`}/>
                <Tooltip
                  cursor={{ stroke: "#f97316", strokeWidth: 1 }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  type="monotone"
                  dataKey="mobile"
                  stroke="#fb923c"
                  fill="#fb923c"
                  fillOpacity={0.2}
                  stackId="a"
                />
                <Area
                  type="monotone"
                  dataKey="desktop"
                  stroke="#ea580c"
                  fill="#ea580c"
                  fillOpacity={0.2}
                  stackId="a"
                />
              </AreaChart>
            </div>
          </ChartContainer>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex justify-between items-center">
          <div className="flex gap-4">
            <Button variant="outline">07 Days</Button>
            <Button variant="ghost">30 Days</Button>
            <Button variant="ghost">6 Months</Button>
            <Button variant="ghost">7 Days</Button>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Export PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ChartComponent;
