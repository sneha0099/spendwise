import { format } from "date-fns";

export default function formatDate(value, pattern = "dd MMM yyyy") {
  if (!value) return "-";
  return format(new Date(value), pattern);
}
