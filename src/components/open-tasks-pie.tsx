"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface AssigneeDatum {
  id: string;
  username: string;
  email: string;
  count: number;
}

interface OpenTasksPieProps {
  data: AssigneeDatum[];
}

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#14b8a6",
  "#e11d48",
];

export function OpenTasksPie({ data }: OpenTasksPieProps) {
  console.log("data from the open tasks pie", data);
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const pieData = data
    .sort((a, b) => b.count - a.count)
    .slice(0, 8) // cap slices for readability
    .map((d) => ({ name: d.username, value: d.count }));

  const legendItems = pieData.map((d, i) => ({
    name: d.name,
    color: COLORS[i % COLORS.length],
    percent: total ? Math.round((d.value / total) * 100) : 0,
    initials: d.name
      .split(" ")
      .map((w) => w[0]?.toUpperCase())
      .slice(0, 2)
      .join(""),
  }));

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = (props: any) => {
    const {
      cx,
      cy,
      midAngle,
      innerRadius = 40,
      outerRadius = 100,
      percent,
      name,
    } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const pct = Math.round((percent || 0) * 100);
    if (pct < 5) return null;
    const initials = String(name)
      .split(" ")
      .map((w: string) => w[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${initials} ${pct}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Open Tasks by Assignee
        </CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="text-sm text-muted-foreground">No open tasks</div>
        ) : (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={30}
                  outerRadius={100}
                  paddingAngle={2}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, _name: string, payload: any) => {
                    const pct = total ? Math.round((value / total) * 100) : 0;
                    return [`${value} (${pct}%)`, payload?.name];
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  height={68}
                  content={() => (
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-3 px-2">
                      {legendItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="relative h-8 w-8 rounded-full text-[10px] font-semibold text-white grid place-items-center"
                          style={{ backgroundColor: item.color }}
                          title={`${item.name} • ${item.percent}%`}
                        >
                          {item.initials || "?"}
                          <span className="absolute -bottom-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-background px-1 text-[9px] font-bold text-foreground shadow">
                            {item.percent}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
