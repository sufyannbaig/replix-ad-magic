import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — Replix AI Ad Studio" },
      {
        name: "description",
        content:
          "Short answers on how Replix studies your products, why it generates batches, and what the credits mean.",
      },
      { property: "og:title", content: "Help — Replix AI Ad Studio" },
      { property: "og:description", content: "How Replix generates ad creatives, explained." },
    ],
  }),
  component: Help,
});

const faqs = [
  {
    q: "Why does Replix study the product first?",
    a: "Templates guess. Reading the photo, the claims and the review language means the hook comes from your actual product, not a fill-in-the-blank sentence.",
  },
  {
    q: "Why generate more ads than I need?",
    a: "The first couple of concepts in any batch are warm-ups. Five gives you a real choice; ten is for when you want to test broadly.",
  },
  {
    q: "What counts as a credit?",
    a: "One generated concept is one credit. Regenerating a single card costs one more.",
  },
  {
    q: "Can I push ads straight to Instagram or Facebook?",
    a: "In this prototype the platform buttons open a preview so you can see the placement. Live publishing is not connected.",
  },
];

function Help() {
  return (
    <AppShell title="Help" subtitle="Quick answers about how the studio works">
      <div className="card-soft max-w-2xl p-6">
        <Accordion type="single" collapsible>
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AppShell>
  );
}
