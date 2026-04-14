import { Pencil, Trash2, TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Progress from "@/components/ui/Progress";
import formatCurrency from "@/utils/formatCurrency";
import { useAuthStore } from "@/store/authStore";

export default function BudgetCard({ budget, onEdit, onDelete }) {
  const currency = useAuthStore((state) => state.user?.currency || "INR");
  const percent = budget.amount ? (budget.spent / budget.amount) * 100 : 0;
  const color = percent >= 100 ? "bg-red-500" : percent >= 70 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl p-3" style={{ backgroundColor: `${budget.category?.color}20` }}>
              <span>{budget.category?.icon}</span>
            </div>
            <div>
              <h3 className="font-semibold">{budget.category?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(budget.spent, currency)} spent of {formatCurrency(budget.amount, currency)}
              </p>
            </div>
          </div>
          {percent >= 90 ? <TriangleAlert className="h-5 w-5 text-amber-500" /> : null}
        </div>
        <Progress value={percent} color={color} />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{percent.toFixed(0)}% used</span>
          <span>{formatCurrency(Math.max(budget.amount - budget.spent, 0), currency)} left</span>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(budget)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(budget)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
