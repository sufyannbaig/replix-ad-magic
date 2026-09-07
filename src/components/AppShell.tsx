import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Sparkles,
  Images,
  FolderOpen,
  Tag,
  CreditCard,
  LifeBuoy,
  Menu,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { store, user } from "@/data/studio";
import { useStudio } from "@/lib/studio-store";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: LucideIcon };

const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/create", label: "Create Ad", icon: Sparkles },
  { to: "/gallery", label: "Ad Gallery", icon: Images },
  { to: "/collections", label: "Collections", icon: FolderOpen },
  { to: "/pricing", label: "Pricing", icon: Tag },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/help", label: "Help", icon: LifeBuoy },
];

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { creditsRemaining, creditsTotal } = useStudio();
  const pct = (creditsRemaining / creditsTotal) * 100;

  return (
    <div className="flex h-full flex-col bg-navy text-navy-foreground">
      <div className="px-6 pt-7 pb-6">
        <Link to="/" onClick={onNavigate} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold font-display text-lg leading-none font-bold text-navy">
            R
          </span>

          <span className="font-display text-lg font-semibold tracking-tight">
            Replix <span className="text-gold">AI</span>
          </span>
        </Link>
        <p className="mt-1 pl-[3.1rem] text-[0.7rem] tracking-[0.18em] text-navy-foreground/45 uppercase">
          Ad Studio
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-gold text-primary-foreground shadow-soft"
                  : "text-navy-foreground/70 hover:bg-navy-soft hover:text-navy-foreground",
              )}
            >
              <Icon className="h-[1.05rem] w-[1.05rem]" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 p-4">
        <div className="rounded-xl bg-navy-soft/70 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[0.7rem] tracking-[0.14em] text-navy-foreground/55 uppercase">
              Credits
            </span>
            <span className="font-display text-sm font-semibold text-gold">
              {creditsRemaining}/{creditsTotal}
            </span>
          </div>
          <Progress value={pct} className="mt-2.5 h-1.5 bg-navy-foreground/15" />
          <p className="mt-2 text-xs text-navy-foreground/55">Free ads remaining this month</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2.5">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">{store.name}</p>
            <p className="truncate text-[0.68rem] text-navy-foreground/55">{store.domain}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <SidebarBody />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur">
          <div className="flex items-center gap-3 px-5 py-4 sm:px-8">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="rounded-lg border border-border p-2 lg:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open navigation</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 border-0 p-0">
                <SidebarBody onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-xl font-semibold">{title}</h1>
              {subtitle ? (
                <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>

            {action}

            <div className="hidden items-center gap-2.5 sm:flex">
              <div className="text-right">
                <p className="text-sm font-semibold">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.plan} plan</p>
              </div>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-navy text-xs font-semibold text-navy-foreground">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 py-7 sm:px-8 sm:py-9">{children}</main>
      </div>
    </div>
  );
}
