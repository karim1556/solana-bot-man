"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart as RechartsLineChart,
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
} from "recharts"

export interface ChartContainerProps {
  children: React.ReactElement
}

export function ChartContainer({ children }: ChartContainerProps) {
  return <div className="w-full h-full">{children}</div>
}

export interface LineChartProps {
  data: any[]
  xAxisKey: string
  series: {
    key: string
    label: string
    color: string
  }[]
  tooltip?: React.ReactElement
}

export function LineChart({ data, xAxisKey, series, tooltip }: LineChartProps) {
  const [dimensions, setDimensions] = useState({ width: 500, height: 300 });
  
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth > 640 ? 500 : 300,
        height: window.innerWidth > 640 ? 300 : 200
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="w-full h-full">
      <RechartsLineChart
        width={dimensions.width}
        height={dimensions.height}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        {tooltip}
        {series.map((s) => (
          <Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color} name={s.label} />
        ))}
      </RechartsLineChart>
    </div>
  )
}

export interface AreaChartProps {
  data: any[]
  xAxisKey: string
  series: {
    key: string
    label: string
    color: string
    area: boolean
  }[]
  tooltip?: React.ReactElement
}

export function AreaChart({ data, xAxisKey, series, tooltip }: AreaChartProps) {
  const [dimensions, setDimensions] = useState({ width: 500, height: 300 });
  
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth > 640 ? 500 : 300,
        height: window.innerWidth > 640 ? 300 : 200
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="w-full h-full">
      <RechartsAreaChart
        width={dimensions.width}
        height={dimensions.height}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        {tooltip}
        {series.map((s) => (
          <Area key={s.key} type="monotone" dataKey={s.key} stroke={s.color} fill={s.color} name={s.label} />
        ))}
      </RechartsAreaChart>
    </div>
  )
}

export interface BarChartProps {
  data: any[]
  xAxisKey: string
  series: {
    key: string
    label: string
    color?: string
    valueFormatter?: (value: any) => string
  }[]
  tooltip?: React.ReactElement
}

export function BarChart({ data, xAxisKey, series, tooltip }: BarChartProps) {
  const [dimensions, setDimensions] = useState({ width: 500, height: 300 });
  
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth > 640 ? 500 : 300,
        height: window.innerWidth > 640 ? 300 : 200
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="w-full h-full">
      <RechartsBarChart
        width={dimensions.width}
        height={dimensions.height}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        {tooltip}
        {series.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            fill={s.color || "hsl(var(--primary))"}
            name={s.label}
          />
        ))}
      </RechartsBarChart>
    </div>
  )
}

