import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";

const schema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().positive("Budget amount must be positive"),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2020)
});

export default function BudgetForm({ open, onClose, onSubmit, categories, initialData, month, year }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { category: "", amount: "", month, year }
  });

  const formMonth = watch("month");
  const formYear = watch("year");

  useEffect(() => {
    reset(
      initialData
        ? { category: initialData.category?._id || initialData.category, amount: initialData.amount, month: initialData.month, year: initialData.year }
        : { category: "", amount: "", month, year }
    );
  }, [initialData, month, year, reset]);

  return (
    <Modal open={open} onClose={onClose} title={initialData ? "Edit Budget" : "Add Budget"}>
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={handleSubmit(async (values) => {
          try {
            console.log("Submitting budget:", values);
            await onSubmit(values);
            toast.success(initialData ? "Budget updated" : "Budget created successfully!");
            reset();
            onClose();
          } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Could not save budget";
            console.error("Budget error:", errorMsg);
            toast.error(errorMsg);
          }
        })}
      >
        <div className="md:col-span-2">
          <Label>Category</Label>
          <Select {...register("category")} disabled={Boolean(initialData)}>
            <option value="">Select category</option>
            {categories
              .filter((category) => category.type !== "income")
              .map((category) => (
                <option key={category._id} value={category._id}>
                  {category.icon} {category.name}
                </option>
              ))}
          </Select>
          <p className="mt-1 text-xs text-red-500">{errors.category?.message}</p>
        </div>
        <div>
          <Label>Amount</Label>
          <Input type="number" step="0.01" {...register("amount")} />
          <p className="mt-1 text-xs text-red-500">{errors.amount?.message}</p>
        </div>
        <div>
          <Label>Month</Label>
          <Input type="number" min="1" max="12" {...register("month")} />
          <p className="mt-1 text-xs text-gray-500 text-[11px]">Current: {formMonth}</p>
        </div>
        <div>
          <Label>Year</Label>
          <Input type="number" min="2020" {...register("year")} />
          <p className="mt-1 text-xs text-gray-500 text-[11px]">Current: {formYear}</p>
        </div>
        <div className="md:col-span-2 flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {initialData ? "Update" : "Create"} Budget
          </Button>
        </div>
      </form>
    </Modal>
  );
}
