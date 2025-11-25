"use client";

import React from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
} from "recharts";
import { Card } from "antd";

interface LineChartProps {
  labels: string[];
  data: number[];
  title?: string;
}

interface BarChartProps {
  labels: string[];
  data: number[];
  title?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  labels,
  data,
  title = "Line Chart",
}) => {
  const chartData = labels.map((label, i) => ({
    name: label,
    value: data[i] ?? 0,
  }));

  return (
    <Card title={title}>
      <ResponsiveContainer width="100%" height={300}>
        <ReLineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export const BarChart: React.FC<BarChartProps> = ({
  labels,
  data,
  title = "Bar Chart",
}) => {
  const chartData = labels.map((label, i) => ({
    name: label,
    value: data[i] ?? 0,
  }));

  return (
    <Card title={title}>
      <ResponsiveContainer width="100%" height={300}>
        <ReBarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#82ca9d" radius={[8, 8, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </Card>
  );
};
