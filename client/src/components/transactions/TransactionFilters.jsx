import { FilterX } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export default function TransactionFilters({ filters, setFilters, categories, onExport, onImportClick }) {
  return (
    <div className="glass-panel grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-6">
      <Input
        placeholder="Search description"
        value={filters.search}
        onChange={(e) => setFilters((state) => ({ ...state, search: e.target.value, page: 1 }))}
      />
      <Select value={filters.type} onChange={(e) => setFilters((state) => ({ ...state, type: e.target.value, page: 1 }))}>
        <option value="">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </Select>
      <Select value={filters.category} onChange={(e) => setFilters((state) => ({ ...state, category: e.target.value, page: 1 }))}>
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </Select>
      <Input type="month" value={`${filters.year}-${String(filters.month).padStart(2, "0")}`} onChange={(e) => {
        const [year, month] = e.target.value.split("-");
        setFilters((state) => ({ ...state, year: Number(year), month: Number(month), page: 1 }));
      }} />
      <Select
        value={filters.paymentMethod}
        onChange={(e) => setFilters((state) => ({ ...state, paymentMethod: e.target.value, page: 1 }))}
      >
        <option value="">All Payments</option>
        <option value="cash">Cash</option>
        <option value="card">Card</option>
        <option value="upi">UPI</option>
        <option value="bank transfer">Bank Transfer</option>
        <option value="other">Other</option>
      </Select>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onExport}>
          Export CSV
        </Button>
        <Button variant="outline" className="flex-1" onClick={onImportClick}>
          Import CSV
        </Button>
      </div>
      <div className="xl:col-span-6 flex justify-end">
        <Button
          variant="ghost"
          onClick={() =>
            setFilters({
              search: "",
              type: "",
              category: "",
              paymentMethod: "",
              page: 1,
              limit: 10,
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear()
            })
          }
        >
          <FilterX className="h-4 w-4" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
