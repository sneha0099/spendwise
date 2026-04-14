import { useRef, useState } from "react";
import { Plus, WalletCards } from "lucide-react";
import toast from "react-hot-toast";
import useTransactions from "@/hooks/useTransactions";
import useCategories from "@/hooks/useCategories";
import { exportTransactionsCsv, importTransactionsCsv } from "@/api/transactionApi";
import AlertDialog from "@/components/ui/AlertDialog";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import TransactionCard from "@/components/transactions/TransactionCard";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionTable from "@/components/transactions/TransactionTable";

export default function Transactions() {
  const today = new Date();
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
    paymentMethod: "",
    page: 1,
    limit: 10,
    month: today.getMonth() + 1,
    year: today.getFullYear()
  });
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const fileRef = useRef(null);
  const { categories } = useCategories();
  const { items, pagination, createItem, updateItem, deleteItem, refresh } = useTransactions(filters);

  const handleExport = async () => {
    const response = await exportTransactionsCsv(filters);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${filters.month}_${filters.year}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await importTransactionsCsv(formData);
    toast.success("CSV imported");
    await refresh();
  };

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Transactions</h1>
          <p className="text-sm text-muted-foreground">Search, filter, import, and manage all money movement.</p>
        </div>
        <Button onClick={() => { setSelectedTransaction(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <TransactionFilters
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        onExport={handleExport}
        onImportClick={() => fileRef.current?.click()}
      />
      <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />

      {items?.length ? (
        <>
          <TransactionTable
            transactions={items}
            onEdit={(transaction) => { setSelectedTransaction(transaction); setFormOpen(true); }}
            onDelete={setDeleteTarget}
          />
          <div className="space-y-4 lg:hidden">
            {items.map((transaction) => (
              <TransactionCard key={transaction._id} transaction={transaction} onEdit={(item) => { setSelectedTransaction(item); setFormOpen(true); }} onDelete={setDeleteTarget} />
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" disabled={filters.page <= 1} onClick={() => setFilters((state) => ({ ...state, page: state.page - 1 }))}>Previous</Button>
            <span className="rounded-xl border px-4 py-2 text-sm">Page {pagination?.page || 1} of {pagination?.totalPages || 1}</span>
            <Button variant="outline" disabled={(pagination?.page || 1) >= (pagination?.totalPages || 1)} onClick={() => setFilters((state) => ({ ...state, page: state.page + 1 }))}>Next</Button>
          </div>
        </>
      ) : (
        <EmptyState icon={WalletCards} title="No transactions yet" description="Add your first transaction to start tracking cash flow." actionLabel="Add Transaction" onAction={() => setFormOpen(true)} />
      )}

      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        categories={categories}
        initialData={selectedTransaction}
        onSubmit={(values) => (selectedTransaction ? updateItem(selectedTransaction._id, values) : createItem(values))}
      />
      <AlertDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete transaction?"
        description="This action cannot be undone."
        onConfirm={async () => {
          await deleteItem(deleteTarget._id);
          toast.success("Transaction deleted");
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
