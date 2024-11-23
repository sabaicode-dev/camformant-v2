"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "#FB923C", // Tailwind color: orange-500
  },
  safari: {
    label: "Safari",
    color: "#04D262", // Tailwind color: green-500
  },
  firefox: {
    label: "Firefox",
    color: "#E64746", // Tailwind color: red-500
  },
  edge: {
    label: "Edge",
    color: "#259AE6", // Tailwind color: blue-500
  },
} satisfies ChartConfig;

function PieChartComponent() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <div className="h-full">
      <Card className="flex flex-col justify-center gap-[87px] shadow-md">
        <CardHeader>
          <CardTitle>Pie Chart - Donut with Text</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="relative w-[300px] h-[300px] "
          >
            <PieChart className="absolute">
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={100}
                outerRadius={120}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Visitors
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-[15px] text-sm pb-[44px]">
          <div className="flex  w-full gap-[5px] items-center">
            <div className="w-[15px] h-[15px] bg-[rgba(251,146,60,1)] rounded-full "></div>
            <p>Web Development</p>
          </div>
          <div className="flex w-full gap-[5px] items-center">
            <div className="w-[15px] h-[15px] bg-[rgba(4,210,98,1)] rounded-full "></div>
            <p>UX-UI</p>
          </div>
          <div className="flex  w-full gap-[5px] items-center">
            <div className="w-[15px] h-[15px] bg-[rgba(230,71,70,1)] rounded-full "></div>
            <p>Web Development</p>
          </div>
          <div className="flex  w-full gap-[5px] items-center">
            <div className="w-[15px] h-[15px] bg-[rgba(37,154,230,1)] rounded-full "></div>
            <p>Web Development</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
export default PieChartComponent;
