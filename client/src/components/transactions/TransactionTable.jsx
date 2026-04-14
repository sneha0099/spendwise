import { Pencil, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import formatCurrency from "@/utils/formatCurrency";
import formatDate from "@/utils/formatDate";
import { useAuthStore } from "@/store/authStore";

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  const currency = useAuthStore((state) => state.user?.currency || "INR");

  return (
    <div className="glass-panel hidden overflow-hidden lg:block">
      <table className="w-full text-left text-sm">
        <thead className="bg-secondary/70 text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id} className="border-t">
              <td className="px-4 py-4">{formatDate(transaction.date)}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <span>{transaction.category?.icon}</span>
                  {transaction.category?.name}
                </div>
              </td>
              <td className="px-4 py-4">{transaction.description || "-"}</td>
              <td className="px-4 py-4 capitalize">{transaction.paymentMethod}</td>
              <td className="px-4 py-4">
                <Badge variant={transaction.type === "income" ? "success" : "danger"}>{transaction.type}</Badge>
              </td>
              <td className={`px-4 py-4 font-semibold ${transaction.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                {formatCurrency(transaction.amount, currency)}
              </td>
              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(transaction)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(transaction)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
