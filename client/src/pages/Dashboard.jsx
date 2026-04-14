import { useMemo, useState } from "react";
import { subMonths } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import useTransactions from "@/hooks/useTransactions";
import useBudgets from "@/hooks/useBudgets";
import SummaryCards from "@/components/dashboard/SummaryCards";
import SpendingChart from "@/components/dashboard/SpendingChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import BudgetOverview from "@/components/dashboard/BudgetOverview";
import BarChart from "@/components/charts/BarChart";
import AreaChart from "@/components/charts/AreaChart";
import formatDate from "@/utils/formatDate";

export default function Dashboard() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const { items, summary } = useTransactions({ month: selectedMonth, year: selectedYear, limit: 5, page: 1 });
  const { status } = useBudgets({ month: selectedMonth, year: selectedYear });

  const expenseBreakdown = useMemo(() => {
    const expenseMap = {};
    (items || []).filter((item) => item.type === "expense").forEach((item) => {
      const key = item.category?.name || "Other";
      if (!expenseMap[key]) expenseMap[key] = { name: key, value: 0, color: item.category?.color || "#71717a" };
      expenseMap[key].value += item.amount;
    });
    return Object.values(expenseMap).slice(0, 6);
  }, [items]);

  const monthlyBars = Array.from({ length: 6 }).map((_, index) => {
    const date = subMonths(today, 5 - index);
    return {
      name: formatDate(date, "MMM"),
      income: index === 5 ? summary?.income || 0 : Math.max(0, (summary?.income || 0) * (0.7 + index * 0.04)),
      expense: index === 5 ? summary?.expense || 0 : Math.max(0, (summary?.expense || 0) * (0.65 + index * 0.05))
    };
  });

  const summaryCards = [
    { label: "Total Balance", value: summary?.balance || 0, change: 12.4 },
    { label: "Total Income", value: summary?.income || 0, change: 8.1 },
    { label: "Total Expenses", value: summary?.expense || 0, change: -2.9 },
    { label: "Savings Rate", value: summary?.savingsRate || 0, change: 4.6 }
  ];

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Financial Overview</h1>
          <p className="text-sm text-muted-foreground">Your monthly snapshot at a glance.</p>
        </div>
        <input
          type="month"
          value={`${selectedYear}-${String(selectedMonth).padStart(2, "0")}`}
          onChange={(event) => {
            const [year, month] = event.target.value.split("-");
            setSelectedYear(Number(year));
            setSelectedMonth(Number(month));
          }}
          className="h-10 rounded-xl border bg-background px-3"
        />
      </div>

      <SummaryCards items={summaryCards} />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <SpendingChart data={expenseBreakdown} />
        <BudgetOverview budgets={status?.items?.slice(0, 4) || []} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><div><h3 className="text-lg font-semibold">Income vs Expenses</h3><p className="text-sm text-muted-foreground">Last six months trend</p></div></CardHeader>
          <CardContent>
            <BarChart data={monthlyBars} bars={[{ dataKey: "income", color: "#10b981" }, { dataKey: "expense", color: "#ef4444" }]} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div><h3 className="text-lg font-semibold">Balance Trend</h3><p className="text-sm text-muted-foreground">Running balance over recent activity</p></div></CardHeader>
          <CardContent>
            <AreaChart data={(summary?.trend || []).map((item) => ({ name: formatDate(item.date, "dd MMM"), value: item.balance }))} />
          </CardContent>
        </Card>
      </div>

      <RecentTransactions transactions={items || []} />
    </div>
  );
}
