import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import formatCurrency from "@/utils/formatCurrency";
import { useAuthStore } from "@/store/authStore";

export default function SpendingChart({ data = [] }) {
  const currency = useAuthStore((state) => state.user?.currency || "INR");

  return (
    <Card>
      <CardHeader>
        <div>
          <h3 className="text-lg font-semibold">Spending by Category</h3>
          <p className="text-sm text-muted-foreground">Where the money went this month</p>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={72} outerRadius={110} paddingAngle={4}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value, currency)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
