import type * as React from "react"

interface ChartProps {
  children: React.ReactNode
}

export const Chart = ({ children }: ChartProps) => {
  return <div className="w-full">{children}</div>
}

interface ChartContainerProps {
  children: React.ReactNode
}

export const ChartContainer = ({ children }: ChartContainerProps) => {
  return <div className="relative">{children}</div>
}

interface ChartTooltipProps {
  children?: React.ReactNode
}

export const ChartTooltip = ({ children }: ChartTooltipProps) => {
  return <div className="pointer-events-none absolute z-10">{children}</div>
}

type ChartTooltipContentProps = {}

export const ChartTooltipContent = ({}: ChartTooltipContentProps) => {
  return <div className="bg-secondary border rounded-md p-2 text-sm">Tooltip Content</div>
}

interface ChartAreaProps {
  data: any[]
  x: string
  y: string
  color: string
}

export const ChartArea = ({ data, x, y, color }: ChartAreaProps) => {
  return <div className="text-sm">Chart Area</div>
}

interface ChartLineProps {
  data: any[]
  x: string
  y: string
  color: string
}

export const ChartLine = ({ data, x, y, color }: ChartLineProps) => {
  return <div className="text-sm">Chart Line</div>
}

type ChartXAxisProps = {}

export const ChartXAxis = ({}: ChartXAxisProps) => {
  return <div className="text-sm">X Axis</div>
}

type ChartYAxisProps = {}

export const ChartYAxis = ({}: ChartYAxisProps) => {
  return <div className="text-sm">Y Axis</div>
}

interface ChartBarProps {
  data: any[]
  x: string
  y: string
  color: string
}

export const ChartBar = ({ data, x, y, color }: ChartBarProps) => {
  return <div className="text-sm">Chart Bar</div>
}

