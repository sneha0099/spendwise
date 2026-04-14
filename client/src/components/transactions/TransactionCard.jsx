import { Pencil, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import formatCurrency from "@/utils/formatCurrency";
import formatDate from "@/utils/formatDate";
import { useAuthStore } from "@/store/authStore";

export default function TransactionCard({ transaction, onEdit, onDelete }) {
  const currency = useAuthStore((state) => state.user?.currency || "INR");

  return (
    <div className="glass-panel space-y-3 p-4 lg:hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{transaction.description || transaction.category?.name}</p>
          <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
        </div>
        <Badge variant={transaction.type === "income" ? "success" : "danger"}>{transaction.type}</Badge>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span>
          {transaction.category?.icon} {transaction.category?.name}
        </span>
        <span className="capitalize">{transaction.paymentMethod}</span>
      </div>
      <div className="flex items-center justify-between">
        <p className={`text-lg font-semibold ${transaction.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
          {formatCurrency(transaction.amount, currency)}
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(transaction)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(transaction)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
