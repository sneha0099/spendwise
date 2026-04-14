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
import Textarea from "@/components/ui/Textarea";
import Checkbox from "@/components/ui/Checkbox";

const schema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
  paymentMethod: z.string().min(1, "Payment method is required"),
  tags: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringInterval: z.string().optional()
});

export default function TransactionForm({ open, onClose, onSubmit, categories, initialData }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "expense",
      amount: "",
      category: "",
      date: new Date().toISOString().slice(0, 10),
      description: "",
      paymentMethod: "upi",
      tags: "",
      isRecurring: false,
      recurringInterval: ""
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        category: initialData.category?._id || initialData.category,
        date: new Date(initialData.date).toISOString().slice(0, 10),
        tags: initialData.tags?.join(", ") || ""
      });
    }
  }, [initialData, reset]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title={initialData ? "Edit Transaction" : "Add Transaction"}>
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={handleSubmit(async (values) => {
          try {
            await onSubmit(values);
            toast.success(initialData ? "Transaction updated" : "Transaction added");
            reset();
            onClose();
          } catch (error) {
            toast.error(error.response?.data?.message || "Could not save transaction");
          }
        })}
      >
        <div>
          <Label>Type</Label>
          <Select {...register("type")}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
          <p className="mt-1 text-xs text-red-500">{errors.type?.message}</p>
        </div>
        <div>
          <Label>Amount</Label>
          <Input type="number" step="0.01" {...register("amount")} />
          <p className="mt-1 text-xs text-red-500">{errors.amount?.message}</p>
        </div>
        <div>
          <Label>Category</Label>
          <Select {...register("category")}>
            <option value="">Select category</option>
            {categories
              .filter((category) => category.type === "both" || category.type === type)
              .map((category) => (
                <option key={category._id} value={category._id}>
                  {category.icon} {category.name}
                </option>
              ))}
          </Select>
          <p className="mt-1 text-xs text-red-500">{errors.category?.message}</p>
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" {...register("date")} />
          <p className="mt-1 text-xs text-red-500">{errors.date?.message}</p>
        </div>
        <div>
          <Label>Payment Method</Label>
          <Select {...register("paymentMethod")}>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="bank transfer">Bank Transfer</option>
            <option value="other">Other</option>
          </Select>
        </div>
        <div>
          <Label>Tags</Label>
          <Input placeholder="food, family, weekend" {...register("tags")} />
        </div>
        <div className="md:col-span-2">
          <Label>Description</Label>
          <Textarea {...register("description")} />
        </div>
        <div className="md:col-span-2 flex items-center justify-between rounded-2xl border p-3">
          <Checkbox label="Recurring transaction" {...register("isRecurring")} />
          {isRecurring ? (
            <Select className="max-w-44" {...register("recurringInterval")}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          ) : null}
        </div>
        <div className="md:col-span-2 flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={() => { reset(); onClose(); }}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Save Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
}
