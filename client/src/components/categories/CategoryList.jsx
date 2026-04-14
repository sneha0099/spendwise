import { Pencil, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function CategoryList({ categories, onEdit, onDelete }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <Card key={category._id}>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl" style={{ backgroundColor: `${category.color}20` }}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.transactionCount} transactions</p>
                </div>
              </div>
              <Badge variant={category.isDefault ? "outline" : "default"}>{category.type}</Badge>
            </div>
            {!category.isDefault ? (
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(category)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
