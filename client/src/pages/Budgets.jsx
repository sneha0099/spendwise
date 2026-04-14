import { Plus, Wallet } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import AlertDialog from "@/components/ui/AlertDialog";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import BudgetCard from "@/components/budgets/BudgetCard";
import BudgetForm from "@/components/budgets/BudgetForm";
import useBudgets from "@/hooks/useBudgets";
import useCategories from "@/hooks/useCategories";
import formatCurrency from "@/utils/formatCurrency";
import { useAuthStore } from "@/store/authStore";

export default function Budgets() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const { budgets, status, createItem, updateItem, deleteItem, refresh } = useBudgets({ month, year });
  const { categories } = useCategories();
  const currency = useAuthStore((state) => state.user?.currency || "INR");

  const handleCreateBudget = async (values) => {
    try {
      await createItem(values);
      // Extra manual refresh to ensure the new budget appears
      await new Promise(resolve => setTimeout(resolve, 100));
      await refresh();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Budgets</h1>
          <p className="text-sm text-muted-foreground">Set monthly category limits and watch spending in real time.</p>
        </div>
        <div className="flex gap-3">
          <input type="month" value={`${year}-${String(month).padStart(2, "0")}`} onChange={(event) => {
            const [nextYear, nextMonth] = event.target.value.split("-");
            setYear(Number(nextYear));
            setMonth(Number(nextMonth));
          }} className="h-10 rounded-xl border bg-background px-3" />
          <Button onClick={() => { setSelectedBudget(null); setFormOpen(true); }}><Plus className="h-4 w-4" />Add Budget</Button>
        </div>
      </div>

      <div className="glass-panel flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-sm text-muted-foreground">Total Budgeted</p><h2 className="text-2xl font-semibold">{formatCurrency(status?.totalBudgeted || 0, currency)}</h2></div>
        <div><p className="text-sm text-muted-foreground">Total Spent</p><h2 className="text-2xl font-semibold">{formatCurrency(status?.totalSpent || 0, currency)}</h2></div>
      </div>

      {budgets.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {budgets.map((budget) => (
            <BudgetCard key={budget._id} budget={budget} onEdit={(item) => { setSelectedBudget(item); setFormOpen(true); }} onDelete={setDeleteTarget} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Wallet} title="No budgets set" description="Create a budget to compare planned vs actual spending." actionLabel="Add Budget" onAction={() => setFormOpen(true)} />
      )}

      <BudgetForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        categories={categories}
        initialData={selectedBudget}
        month={month}
        year={year}
        onSubmit={(values) => (selectedBudget ? updateItem(selectedBudget._id, { amount: values.amount }) : handleCreateBudget(values))}
      />
      <AlertDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete budget?"
        description="This removes the monthly limit but keeps past transactions."
        onConfirm={async () => {
          await deleteItem(deleteTarget._id);
          toast.success("Budget deleted");
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
