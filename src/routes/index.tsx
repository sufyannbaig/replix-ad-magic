import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowRight, Copy, Link2, Store, Upload } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { AdCard } from "@/components/AdCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products } from "@/data/studio";
import { fileToDataUrl } from "@/lib/image-utils";
import { setProductIntake } from "@/lib/product-intake";
import { useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Replix AI Ad Studio" },
      { name: "description", content: "Generate product ads, revisit recent creatives, and manage your Replix workspace." },
      { property: "og:title", content: "Dashboard — Replix AI Ad Studio" },
      { property: "og:description", content: "Generate product ads and revisit your latest Replix creatives." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { ads } = useStudio();
  const [connected, setConnected] = useState(true);
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const chooseUpload = async (file?: File) => {
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setProductIntake({ kind: "upload", name: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "), dataUrl });
      window.location.assign("/create");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn't read that image.");
    }
  };

  return (
    <AppShell title="Generate Ads that stop the scroll. In seconds.">
      <div className="space-y-10">
        {connected ? (
          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold">Promote Best Sellers</h2>
                <p className="mt-1 text-sm text-muted-foreground">Select your Shopify product and generate ads.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setConnected(false)}>Disconnect demo</Button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {products.map((product) => (
                <Link key={product.id} to="/create" className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                  <img src={product.image} alt={product.name} className="aspect-square w-full object-cover transition-transform group-hover:scale-[1.02]" />
                  <div className="p-4">
                    <p className="font-display text-sm font-semibold sm:text-base">{product.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="overflow-hidden rounded-3xl bg-success px-6 py-12 text-center text-navy-foreground sm:px-12">
            <Store className="mx-auto h-11 w-11" />
            <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">Connect Your Shopify Store</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-navy-foreground/80">Sync your Shopify catalog and create studio-quality ads with optimized copy in under 60 seconds.</p>
            <Button className="mt-6 rounded-full bg-card px-6 text-navy hover:bg-card/90" onClick={() => setConnected(true)}><Link2 /> Connect Store</Button>
          </section>
        )}

        <div className="flex items-center gap-5"><span className="h-px flex-1 bg-border" /><span className="text-xs font-semibold text-muted-foreground">OR</span><span className="h-px flex-1 bg-border" /></div>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col items-center rounded-3xl border border-border bg-card px-8 py-12 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary"><Upload className="h-6 w-6 text-navy" /></span>
            <h2 className="mt-6 font-display text-xl font-semibold">Upload Product Image</h2>
            <p className="mt-2 text-sm text-muted-foreground">Use JPG, PNG, or WEBP (max 10 MB).</p>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => void chooseUpload(e.target.files?.[0])} />
            <Button variant="outline" className="mt-6 rounded-full px-6" onClick={() => inputRef.current?.click()}><Upload /> Upload Image</Button>
          </div>
          <div className="flex flex-col items-center rounded-3xl border border-border bg-card px-8 py-12 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy"><Link2 className="h-6 w-6 text-gold" /></span>
            <h2 className="mt-6 font-display text-xl font-semibold">Enter Your Product URL</h2>
            <div className="mt-6 flex w-full max-w-md rounded-full border border-input bg-background p-1.5 pl-4">
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourstore.com/products/..." className="h-9 flex-1 border-0 bg-transparent px-0 shadow-none" />
              <Button className="rounded-full" onClick={() => { if (!url.trim()) { toast.error("Enter a product URL first."); return; } setProductIntake({ kind: "url", url: url.trim() }); window.location.assign("/create"); }}>Analyze</Button>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between gap-4"><h2 className="font-display text-2xl font-semibold">Recent Generated Ads</h2><Button asChild variant="outline" className="rounded-full"><Link to="/gallery">View All</Link></Button></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{ads.slice(0, 3).map((ad) => <AdCard key={ad.id} ad={ad} compact />)}</div>
        </section>

        <section className="flex flex-col justify-between gap-8 rounded-3xl border border-border bg-card p-8 sm:flex-row sm:items-center lg:p-10">
          <div><span className="rounded-full border border-navy bg-secondary px-3 py-1.5 text-xs font-semibold">Refer &amp; Earn</span><h2 className="mt-5 font-display text-2xl font-semibold">Give 10 Credits, Get 10 Credits</h2><p className="mt-2 text-sm text-muted-foreground">Share your link. When a friend signs up, you both get 10 free credits.</p><Button variant="outline" className="mt-6 rounded-full" onClick={() => { void navigator.clipboard.writeText("https://replixai.co.uk/login?ref=GQZXXLMB"); toast.success("Referral link copied"); }}><Copy /> Copy referral link</Button></div>
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gold-soft text-5xl font-bold text-gold">R</div>
        </section>
      </div>
    </AppShell>
  );
}