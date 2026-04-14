import { Area, AreaChart as ReAreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AreaChart({ data = [], xKey = "name", dataKey = "value", color = "#14b8a6" }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReAreaChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.18} />
      </ReAreaChart>
    </ResponsiveContainer>
  );
}
