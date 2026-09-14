import { Link, useRouterState } from "@tanstack/react-router";
import {
  Menu,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/studio-store";
import { cn } from "@/lib/utils";
import creditCoin from "@/assets/redesign/credit-coin.png";

type NavItem = { to: "/" | "/gallery" | "/campaigns" | "/analytics" | "/pricing" | "/help"; label: string };

const navItems: NavItem[] = [
  { to: "/", label: "Dashboard" },
  { to: "/gallery", label: "My Creatives" },
  { to: "/campaigns", label: "My Campaigns" },
  { to: "/analytics", label: "Analytics" },
  { to: "/pricing", label: "Pricing & Billing" },
  { to: "/help", label: "Help" },
];

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link to="/" onClick={onNavigate} className="flex shrink-0 items-center gap-3" aria-label="Replix AI dashboard">
      <span className="flex h-10 w-10 items-center justify-center bg-navy font-display text-xl font-bold text-gold">
        R
      </span>
      <span className="font-display text-base font-bold tracking-[0.2em] text-navy">REPLIX AI</span>
    </Link>
  );
}

function NavLinks({ onNavigate, mobile = false }: { onNavigate?: () => void; mobile?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className={cn(mobile ? "flex flex-col gap-1" : "flex items-center gap-7 xl:gap-9")} aria-label="Primary navigation">
      {navItems.map(({ to, label }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "relative text-sm font-medium text-muted-foreground transition-colors hover:text-navy",
              mobile ? "rounded-lg px-3 py-3" : "py-2",
              active && "text-navy",
              active && !mobile && "after:absolute after:inset-x-0 after:-bottom-2.5 after:h-0.5 after:rounded-full after:bg-navy",
              active && mobile && "bg-secondary font-semibold",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function CreditsPill() {
  const { creditsRemaining, creditsTotal } = useStudio();

  return (
    <div className="flex shrink-0 items-center gap-2 rounded-full border border-gold/60 bg-gold-soft/60 px-3 py-1.5 text-navy">
      <img src={creditCoin} alt="" className="h-5 w-5" />
      <span className="text-sm font-bold tabular-nums">
        {creditsRemaining}/{creditsTotal}
      </span>
      <span className="rounded-full bg-card px-2 py-0.5 text-[0.65rem] font-semibold text-muted-foreground">
        FREE
      </span>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  action,
  titleGradient = false,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  titleGradient?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="dot-canvas min-h-screen w-full">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between gap-5 px-5 sm:px-8 lg:h-[88px] lg:px-10">
          <Brand />
          <div className="hidden lg:block">
            <NavLinks />
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="gradient" className="hidden h-11 rounded-full px-7 sm:inline-flex">
              <Link to="/create">
                <Sparkles className="h-4 w-4" /> Generate Ads
              </Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-navy lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[19rem] p-6">
                <Brand onNavigate={() => setOpen(false)} />
                <div className="mt-10">
                  <NavLinks onNavigate={() => setOpen(false)} mobile />
                </div>
                <Button asChild className="mt-6 h-11 w-full rounded-full bg-navy text-navy-foreground hover:bg-navy-soft">
                  <Link to="/create" onClick={() => setOpen(false)}>
                    <Sparkles className="h-4 w-4" /> Generate Ads
                  </Link>
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1104px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
        <div className={cn("flex items-start justify-between gap-4", title || subtitle ? "mb-7" : "mb-5")}>
          <div className="min-w-0 flex-1">
              {title ? (
                <h1
                  className={cn(
                    "font-display text-2xl font-semibold sm:text-3xl",
                    titleGradient ? "brand-gradient-text" : "text-foreground",
                  )}
                >
                  {title}
                </h1>
              ) : null}
              {subtitle ? (
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
              ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {action}
            <CreditsPill />
          </div>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
