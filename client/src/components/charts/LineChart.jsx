import { CartesianGrid, Line, LineChart as ReLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function LineChart({ data = [], xKey = "name", dataKey = "value", color = "#0ea5e9" }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReLineChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Line dataKey={dataKey} stroke={color} strokeWidth={3} dot={false} />
      </ReLineChart>
    </ResponsiveContainer>
  );
}
