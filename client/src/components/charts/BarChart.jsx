import { Bar, BarChart as ReBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function BarChart({ data = [], xKey = "name", bars = [] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        {bars.map((bar) => (
          <Bar key={bar.dataKey} dataKey={bar.dataKey} fill={bar.color} radius={[10, 10, 0, 0]} />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  );
}
