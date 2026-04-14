import { Bell, LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

const titles = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/budgets": "Budgets",
  "/categories": "Categories",
  "/reports": "Reports",
  "/profile": "Profile"
};

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { toggleSidebar, theme, setTheme } = useUiStore();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={toggleSidebar}>
            <Menu className="h-4 w-4" />
          </Button>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">SpendWise</p>
            <h2 className="text-lg font-semibold">{titles[pathname] || "Overview"}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/profile")}>
            <User className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
          <Avatar src={user?.avatar} fallback={user?.name || "SW"} className="h-9 w-9" />
        </div>
      </div>
    </header>
  );
}
