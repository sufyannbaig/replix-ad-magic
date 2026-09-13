import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BadgeCheck, Image, Mail, Receipt, Rocket, Search, Upload, User, type LucideIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/help")({ head: () => ({ meta: [
  { title: "Help & FAQ — Replix AI Ad Studio" }, { name: "description", content: "Find answers about generating, exporting, billing, and managing your Replix AI account." },
  { property: "og:title", content: "Help & FAQ — Replix AI Ad Studio" }, { property: "og:description", content: "Find answers about Replix AI generation, exports, billing, and account settings." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Help });

type Category = "All" | "Getting Started" | "Generation" | "Exports" | "Billing" | "Account";
const categories: { key: Category; icon: LucideIcon }[] = [{ key: "All", icon: BadgeCheck }, { key: "Getting Started", icon: Rocket }, { key: "Generation", icon: Image }, { key: "Exports", icon: Upload }, { key: "Billing", icon: Receipt }, { key: "Account", icon: User }];
const faqs: { category: Exclude<Category, "All">; question: string; answer: string }[] = [
  { category: "Getting Started", question: "How do I get started with Replix AI?", answer: "Choose a Shopify product, upload a product photo, or paste a product URL. Replix studies it before you select themes and generate ads." },
  { category: "Getting Started", question: "Do I need a Shopify store?", answer: "No. You can upload a product image or paste a product URL instead. Connecting Shopify simply makes your catalog available instantly." },
  { category: "Generation", question: "What ad styles are available?", answer: "Choose from ten styles including product showcase, social proof, testimonials, before-and-after, offers, and comparisons." },
  { category: "Generation", question: "Why does Replix study the product first?", answer: "The analysis grounds copy and visuals in the real packaging, claims, materials, audience, and customer need." },
  { category: "Exports", question: "How do I download a creative?", answer: "Open My Creatives and use the download action on any completed image." },
  { category: "Billing", question: "What counts as one credit?", answer: "Each generated concept uses one credit. Regenerating an individual card also uses one credit." },
  { category: "Account", question: "Can I publish directly to social platforms?", answer: "The current demo provides placement previews and downloads. Direct publishing is not connected." },
];

function Help() { const [query, setQuery] = useState(""); const [category, setCategory] = useState<Category>("All"); const filtered = useMemo(() => faqs.filter((item) => (category === "All" || item.category === category) && `${item.question} ${item.answer}`.toLowerCase().includes(query.toLowerCase())), [query, category]); return <AppShell title="How can we help?" subtitle="Answers about generating ads, billing, and your account.">
  <div className="grid gap-6 lg:grid-cols-[1fr_320px]"><div><div className="relative"><Search className="absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles..." className="h-14 rounded-full bg-card pl-12" /></div><div className="mt-4 flex flex-wrap gap-2">{categories.map(({ key, icon: Icon }) => <button key={key} onClick={() => setCategory(key)} className={cn("inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium", category === key ? "border-navy bg-navy text-navy-foreground" : "border-border bg-card text-muted-foreground")}><Icon className="h-4 w-4" />{key}</button>)}</div><Accordion type="single" collapsible defaultValue={faqs[0]?.question} className="mt-6 space-y-4">{filtered.map((item) => <AccordionItem key={`${item.category}-${item.question}`} value={item.question} className="rounded-2xl border border-border bg-card px-6"><AccordionTrigger className="text-left font-semibold text-navy">{item.question}</AccordionTrigger><AccordionContent className="leading-6 text-muted-foreground">{item.answer}</AccordionContent></AccordionItem>)}</Accordion>{filtered.length === 0 ? <p className="mt-6 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">No articles match your search.</p> : null}</div><aside className="h-fit rounded-2xl bg-navy p-8 text-navy-foreground lg:sticky lg:top-28"><h2 className="font-display text-2xl font-bold">Still need help?</h2><p className="mt-3 text-sm leading-6 text-navy-foreground/75">Email our support team and we’ll get back to you within one business day.</p><Button className="mt-6 w-full rounded-full bg-card text-navy hover:bg-card/90" onClick={() => window.location.href = "mailto:support@replixai.co.uk"}><Mail /> Email Us</Button></aside></div>
  </AppShell>; }