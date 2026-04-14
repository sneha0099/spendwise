import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import formatCurrency from "@/utils/formatCurrency";
import formatDate from "@/utils/formatDate";
import { useAuthStore } from "@/store/authStore";

export default function RecentTransactions({ transactions = [] }) {
  const currency = useAuthStore((state) => state.user?.currency || "INR");

  return (
    <Card>
      <CardHeader>
        <div>
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <p className="text-sm text-muted-foreground">Latest activity from your wallet</p>
        </div>
        <Link to="/transactions" className="text-sm font-medium text-sky-500">
          View All
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction._id} className="flex items-center justify-between gap-3 rounded-2xl border p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${transaction.category?.color}20` }}>
                <span>{transaction.category?.icon}</span>
              </div>
              <div>
                <p className="font-medium">{transaction.description || transaction.category?.name}</p>
                <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={transaction.type === "income" ? "success" : "danger"}>{transaction.type}</Badge>
              <p className={`mt-2 font-semibold ${transaction.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount, currency)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
