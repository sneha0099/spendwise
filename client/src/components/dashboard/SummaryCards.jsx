import { ArrowDownRight, ArrowUpRight, Landmark, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import formatCurrency from "@/utils/formatCurrency";
import { useAuthStore } from "@/store/authStore";

const icons = [Landmark, TrendingUp, TrendingDown, PiggyBank];
const colors = ["text-sky-500", "text-emerald-500", "text-rose-500", "text-amber-500"];

export default function SummaryCards({ items }) {
  const currency = useAuthStore((state) => state.user?.currency || "INR");

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const Icon = icons[index];
        const positive = item.change >= 0;

        return (
          <Card key={item.label}>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <h3 className="mt-2 text-2xl font-semibold">{formatCurrency(item.value, currency)}</h3>
                </div>
                <div className={`rounded-2xl bg-secondary p-3 ${colors[index]}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {positive ? <ArrowUpRight className="h-4 w-4 text-emerald-500" /> : <ArrowDownRight className="h-4 w-4 text-rose-500" />}
                <span className={positive ? "text-emerald-500" : "text-rose-500"}>{Math.abs(item.change).toFixed(1)}%</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
