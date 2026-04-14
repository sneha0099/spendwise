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
  name: z.string().min(2, "Name is required"),
  type: z.enum(["income", "expense", "both"]),
  icon: z.string().min(1, "Pick an icon"),
  color: z.string().min(4, "Pick a color")
});

const emojiOptions = ["🍜", "🚌", "🛍️", "🎬", "💊", "📚", "💡", "🏠", "💼", "📈", "🎁", "✨"];
const colorOptions = ["#f97316", "#0ea5e9", "#8b5cf6", "#10b981", "#ef4444", "#eab308", "#ec4899", "#71717a"];

export default function CategoryForm({ open, onClose, onSubmit, initialData }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", type: "expense", icon: "✨", color: "#71717a" }
  });

  useEffect(() => {
    reset(initialData || { name: "", type: "expense", icon: "✨", color: "#71717a" });
  }, [initialData, reset]);

  const selectedIcon = watch("icon");
  const selectedColor = watch("color");

  return (
    <Modal open={open} onClose={onClose} title={initialData ? "Edit Category" : "Add Category"}>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          try {
            await onSubmit(values);
            toast.success(initialData ? "Category updated" : "Category created");
            onClose();
          } catch (error) {
            toast.error(error.response?.data?.message || "Could not save category");
          }
        })}
      >
        <div>
          <Label>Name</Label>
          <Input {...register("name")} />
          <p className="mt-1 text-xs text-red-500">{errors.name?.message}</p>
        </div>
        <div>
          <Label>Type</Label>
          <Select {...register("type")}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="both">Both</option>
          </Select>
        </div>
        <div>
          <Label>Pick an Icon</Label>
          <div className="grid grid-cols-6 gap-2">
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`rounded-2xl border p-3 text-xl ${selectedIcon === emoji ? "border-zinc-900 dark:border-white" : ""}`}
                onClick={() => setValue("icon", emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>Pick a Color</Label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                className={`h-10 w-10 rounded-full border-2 ${selectedColor === color ? "border-zinc-900 dark:border-white" : "border-transparent"}`}
                style={{ backgroundColor: color }}
                onClick={() => setValue("color", color)}
              />
            ))}
          </div>
        </div>
        <input type="hidden" {...register("icon")} />
        <input type="hidden" {...register("color")} />
        <div className="flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Save Category
          </Button>
        </div>
      </form>
    </Modal>
  );
}
