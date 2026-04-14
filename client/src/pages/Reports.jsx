import { useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import useTransactions from "@/hooks/useTransactions";
import formatCurrency from "@/utils/formatCurrency";
import { useAuthStore } from "@/store/authStore";

export default function Reports() {
  const [range, setRange] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear(), limit: 100, page: 1 });
  const { items, summary } = useTransactions(range);
  const currency = useAuthStore((state) => state.user?.currency || "INR");

  const categoryRows = useMemo(() => {
    const map = {};
    items.filter((item) => item.type === "expense").forEach((item) => {
      const key = item.category?.name || "Other";
      if (!map[key]) map[key] = { name: key, value: 0, count: 0, color: item.category?.color || "#71717a" };
      map[key].value += item.amount;
      map[key].count += 1;
    });
    return Object.values(map).sort((a, b) => b.value - a.value);
  }, [items]);

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Reports</h1>
          <p className="text-sm text-muted-foreground">See patterns, largest transactions, and category-wise spend.</p>
        </div>
        <div className="flex gap-3">
          <input type="month" value={`${range.year}-${String(range.month).padStart(2, "0")}`} onChange={(event) => {
            const [year, month] = event.target.value.split("-");
            setRange((state) => ({ ...state, year: Number(year), month: Number(month) }));
          }} className="h-10 rounded-xl border bg-background px-3" />
          <Button variant="outline" onClick={() => window.print()}><FileDown className="h-4 w-4" />Download PDF</Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><div><h3 className="text-lg font-semibold">Income vs Expense Summary</h3><p className="text-sm text-muted-foreground">This month snapshot</p></div></CardHeader>
          <CardContent>
            <BarChart data={[{ name: "Income", value: summary?.income || 0 }, { name: "Expenses", value: summary?.expense || 0 }, { name: "Savings", value: summary?.balance || 0 }]} bars={[{ dataKey: "value", color: "#0ea5e9" }]} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div><h3 className="text-lg font-semibold">Balance Trend</h3><p className="text-sm text-muted-foreground">Running balance across the selected period</p></div></CardHeader>
          <CardContent>
            <LineChart data={(summary?.trend || []).map((item) => ({ name: new Date(item.date).getDate(), value: item.balance }))} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><div><h3 className="text-lg font-semibold">Spending by Category</h3><p className="text-sm text-muted-foreground">Ranked by total spend</p></div></CardHeader>
        <CardContent className="space-y-3">
          {categoryRows.map((row) => (
            <div key={row.name} className="flex items-center justify-between rounded-2xl border p-4">
              <div><p className="font-medium">{row.name}</p><p className="text-sm text-muted-foreground">{row.count} transactions</p></div>
              <p className="font-semibold">{formatCurrency(row.value, currency)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><div><h3 className="text-lg font-semibold">Top Expenses</h3><p className="text-sm text-muted-foreground">Largest outgoing transactions</p></div></CardHeader>
          <CardContent className="space-y-3">
            {items.filter((item) => item.type === "expense").sort((a, b) => b.amount - a.amount).slice(0, 5).map((item) => (
              <div key={item._id} className="flex justify-between rounded-2xl border p-4"><span>{item.description || item.category?.name}</span><span className="font-semibold">{formatCurrency(item.amount, currency)}</span></div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div><h3 className="text-lg font-semibold">Top Income</h3><p className="text-sm text-muted-foreground">Largest incoming transactions</p></div></CardHeader>
          <CardContent className="space-y-3">
            {items.filter((item) => item.type === "income").sort((a, b) => b.amount - a.amount).slice(0, 5).map((item) => (
              <div key={item._id} className="flex justify-between rounded-2xl border p-4"><span>{item.description || item.category?.name}</span><span className="font-semibold">{formatCurrency(item.amount, currency)}</span></div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
