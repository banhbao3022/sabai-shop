"use client";

import { useState, type FormEvent } from "react";
import { Lock, LayoutDashboard, Package, ClipboardList, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/layout/container";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminProducts } from "@/components/admin/admin-products";
import { AdminOrders } from "@/components/admin/admin-orders";
import { useI18n } from "@/lib/i18n";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

const PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "admin";
const SESSION_KEY = "sabai.admin.unlocked";

type Tab = "dashboard" | "products" | "orders";

export function AdminApp() {
  const { t } = useI18n();
  const hydrated = useHydrated();
  // Safe to read sessionStorage in the initializer: the component renders a
  // placeholder until `hydrated`, so this never affects the hydration render.
  const [unlocked, setUnlocked] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1",
  );
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (pass === PASSCODE) {
      setUnlocked(true);
      setError(false);
      sessionStorage.setItem(SESSION_KEY, "1");
    } else {
      setError(true);
    }
  };

  const lock = () => {
    setUnlocked(false);
    setPass("");
    sessionStorage.removeItem(SESSION_KEY);
  };

  if (!hydrated) {
    return <div className="text-muted-foreground py-24 text-center">…</div>;
  }

  if (!unlocked) {
    return (
      <Container className="flex min-h-[60vh] items-center justify-center py-10">
        <form
          onSubmit={submit}
          className="bg-card w-full max-w-sm space-y-4 rounded-xl border p-6"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
              <Lock className="size-6" />
            </span>
            <h1 className="text-lg font-bold">{t.admin.title}</h1>
            <p className="text-muted-foreground text-sm">{t.admin.login}</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="passcode">{t.admin.login}</Label>
            <Input
              id="passcode"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoFocus
            />
            {error && <p className="text-destructive text-xs">{t.admin.wrongPass}</p>}
          </div>
          <Button type="submit" className="w-full">{t.admin.loginCta}</Button>
        </form>
      </Container>
    );
  }

  const tabs: { id: Tab; label: string; Icon: typeof Package }[] = [
    { id: "dashboard", label: t.admin.dashboard, Icon: LayoutDashboard },
    { id: "products", label: t.admin.products, Icon: Package },
    { id: "orders", label: t.admin.orders, Icon: ClipboardList },
  ];

  return (
    <Container className="py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{t.admin.title}</h1>
        <Button variant="outline" size="sm" onClick={lock} className="gap-1.5">
          <LogOut className="size-4" />
          {t.admin.logout}
        </Button>
      </div>

      <div className="bg-muted mb-6 inline-flex gap-1 rounded-lg p-1">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              tab === id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && <AdminDashboard onNavigate={setTab} />}
      {tab === "products" && <AdminProducts />}
      {tab === "orders" && <AdminOrders />}
    </Container>
  );
}
