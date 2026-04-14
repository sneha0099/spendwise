import { Plus, Shapes } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import AlertDialog from "@/components/ui/AlertDialog";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import CategoryForm from "@/components/categories/CategoryForm";
import CategoryList from "@/components/categories/CategoryList";
import useCategories from "@/hooks/useCategories";

export default function Categories() {
  const [tab, setTab] = useState("expense");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { categories, createItem, updateItem, deleteItem } = useCategories();

  const filtered = useMemo(
    () => categories.filter((category) => category.type === tab || category.type === "both"),
    [categories, tab]
  );

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">Mix system defaults with custom categories that match your life.</p>
        </div>
        <Button onClick={() => { setSelectedCategory(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Tabs tabs={[{ label: "Expense Categories", value: "expense" }, { label: "Income Categories", value: "income" }]} value={tab} onChange={setTab} />

      {filtered.length ? (
        <CategoryList categories={filtered} onEdit={(category) => { setSelectedCategory(category); setFormOpen(true); }} onDelete={setDeleteTarget} />
      ) : (
        <EmptyState icon={Shapes} title="No categories here" description="Create a category to organize your transactions." actionLabel="Add Category" onAction={() => setFormOpen(true)} />
      )}

      <CategoryForm open={formOpen} onClose={() => setFormOpen(false)} initialData={selectedCategory} onSubmit={(values) => (selectedCategory ? updateItem(selectedCategory._id, values) : createItem(values))} />
      <AlertDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete category?"
        description="You can only delete custom categories that are not in use."
        onConfirm={async () => {
          await deleteItem(deleteTarget._id);
          toast.success("Category deleted");
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
