import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Progress from "@/components/ui/Progress";
import formatCurrency from "@/utils/formatCurrency";
import { useAuthStore } from "@/store/authStore";

export default function BudgetOverview({ budgets = [] }) {
  const currency = useAuthStore((state) => state.user?.currency || "INR");

  return (
    <Card>
      <CardHeader>
        <div>
          <h3 className="text-lg font-semibold">Budget Overview</h3>
          <p className="text-sm text-muted-foreground">Keep an eye on your top categories</p>
        </div>
        <Link to="/budgets" className="text-sm font-medium text-sky-500">
          View All
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.map((budget) => {
          const percent = budget.amount ? (budget.spent / budget.amount) * 100 : 0;
          const color = percent >= 90 ? "bg-red-500" : percent >= 70 ? "bg-amber-500" : "bg-emerald-500";

          return (
            <div key={budget._id} className="space-y-2 rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{budget.category?.icon}</span>
                  <div>
                    <p className="font-medium">{budget.category?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(budget.spent, currency)} / {formatCurrency(budget.amount, currency)}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium">{percent.toFixed(0)}%</span>
              </div>
              <Progress value={percent} color={color} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
