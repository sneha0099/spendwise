import { NavLink } from "react-router-dom";
import { CreditCard, LayoutDashboard, ListTree, PieChart, Receipt, UserCircle, Wallet } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/budgets", label: "Budgets", icon: Wallet },
  { to: "/categories", label: "Categories", icon: ListTree },
  { to: "/reports", label: "Reports", icon: PieChart },
  { to: "/profile", label: "Profile", icon: UserCircle }
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, closeSidebar } = useUiStore();

  return (
    <>
      <aside className="hidden w-72 border-r bg-background/80 p-4 lg:flex lg:flex-col">
        <SidebarContent user={user} logout={logout} />
      </aside>
      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 bg-zinc-950/50 lg:hidden" onClick={closeSidebar}>
          <aside className="h-full w-72 border-r bg-background p-4" onClick={(event) => event.stopPropagation()}>
            <SidebarContent user={user} logout={logout} onNavigate={closeSidebar} />
          </aside>
        </div>
      ) : null}
    </>
  );
}

function SidebarContent({ user, logout, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="rounded-2xl bg-zinc-900 p-3 text-white dark:bg-white dark:text-zinc-900">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">SpendWise</p>
          <h1 className="text-lg font-semibold">Expense Tracker</h1>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "text-muted-foreground hover:bg-secondary"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border bg-secondary/50 p-4">
        <div className="mb-4 flex items-center gap-3">
          <Avatar src={user?.avatar} fallback={user?.name || "SW"} />
          <div className="min-w-0">
            <p className="truncate font-medium">{user?.name}</p>
            <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
