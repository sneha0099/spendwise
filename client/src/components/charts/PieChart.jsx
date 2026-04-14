import { Cell, Pie, PieChart as RePieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function PieChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RePieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </RePieChart>
    </ResponsiveContainer>
  );
}
