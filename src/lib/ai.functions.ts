import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type ProductAnalysis = {
  productType: string;
  colors: string[];
  materials: string[];
  visibleText: string[];
  claims: string[];
  insights: string[];
  audiences: string[];
  sellingAngle: string;
  visualNotes: string;
};

export type ConceptCopy = {
  theme: string;
  audience: string;
  coreIdea: string;
  headline: string;
  caption: string;
  cta: string;
  imageBrief: string;
};

const CHAT_MODEL = "openai/gpt-5.6-sol";

const analyzeInput = z.object({
  imageDataUrl: z.string().min(30),
  productName: z.string().optional(),
  price: z.number().optional(),
  storeName: z.string().optional(),
});

export const analyzeProductImage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => analyzeInput.parse(data))
  .handler(async ({ data }): Promise<ProductAnalysis> => {
    const { gatewayChat, parseJsonBlock } = await import("./ai-gateway.server");

    const brief = [
      data.productName ? `Product name given by the seller: ${data.productName}.` : "",
      data.price ? `Price: $${data.price.toFixed(2)}.` : "",
      data.storeName ? `Store: ${data.storeName}.` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const raw = await gatewayChat({
      model: CHAT_MODEL,
      reasoning_effort: "none",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a senior direct-response creative strategist analysing a product photo for a paid-social ad. Only report what is genuinely visible in the image. Never invent label text, certifications or review numbers. Reply with JSON only.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${brief}\n\nStudy this product photo and return JSON with exactly these keys:\n{\n  "productType": short description of what the product is,\n  "colors": 3-5 specific colours actually visible (packaging and scene),\n  "materials": 2-4 materials/finishes visible (e.g. matte plastic, glass, kraft paper),\n  "visibleText": every piece of text you can actually read on the packaging (empty array if none legible),\n  "claims": claims or badges visible on the pack (empty array if none),\n  "insights": 4 short, specific selling-point insights a strategist would write after looking at this photo, each one sentence, grounded in what you saw,\n  "audiences": 3 concrete best-fit audience descriptions,\n  "sellingAngle": the single strongest selling angle in one sentence,\n  "visualNotes": one sentence on how this product photographs best (lighting, backdrop, tones)\n}`,
            },
            { type: "image_url", image_url: { url: data.imageDataUrl } },
          ],
        },
      ],
    });

    const parsed = parseJsonBlock<Partial<ProductAnalysis>>(raw);
    return {
      productType: parsed.productType ?? data.productName ?? "Product",
      colors: parsed.colors ?? [],
      materials: parsed.materials ?? [],
      visibleText: parsed.visibleText ?? [],
      claims: parsed.claims ?? [],
      insights: (parsed.insights ?? []).slice(0, 4),
      audiences: (parsed.audiences ?? []).slice(0, 3),
      sellingAngle: parsed.sellingAngle ?? "",
      visualNotes: parsed.visualNotes ?? "",
    };
  });

const copyInput = z.object({
  analysis: z.object({
    productType: z.string(),
    colors: z.array(z.string()),
    materials: z.array(z.string()),
    visibleText: z.array(z.string()),
    claims: z.array(z.string()),
    insights: z.array(z.string()),
    audiences: z.array(z.string()),
    sellingAngle: z.string(),
    visualNotes: z.string(),
  }),
  productName: z.string(),
  price: z.number().optional(),
  storeName: z.string().optional(),
  objective: z.string(),
  objectiveLabel: z.string(),
  themes: z.array(z.object({ id: z.string(), label: z.string(), logic: z.string() })).min(1),
  format: z.string(),
  count: z.number().min(1).max(10),
  variantSeed: z.number().optional(),
});

export const generateAdCopy = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => copyInput.parse(data))
  .handler(async ({ data }): Promise<ConceptCopy[]> => {
    const { gatewayChat, parseJsonBlock } = await import("./ai-gateway.server");

    const a = data.analysis;
    const raw = await gatewayChat({
      model: CHAT_MODEL,
      reasoning_effort: "none",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a world-class direct-response copywriter and art director for paid social. Write specific, human copy — no filler, no emoji spam, no invented statistics or fake reviews. Reply with JSON only.",
        },
        {
          role: "user",
          content: `Product: ${data.productName}${data.price ? ` ($${data.price.toFixed(2)})` : ""}${data.storeName ? ` from ${data.storeName}` : ""}.
What the photo analysis found:
- Type: ${a.productType}
- Colours: ${a.colors.join(", ")}
- Materials: ${a.materials.join(", ")}
- Text on pack: ${a.visibleText.join(" | ") || "none legible"}
- Claims on pack: ${a.claims.join(" | ") || "none"}
- Insights: ${a.insights.join(" ")}
- Audiences: ${a.audiences.join(" | ")}
- Strongest angle: ${a.sellingAngle}
- Photographs best: ${a.visualNotes}

Campaign objective: ${data.objectiveLabel}.
Creative themes to rotate through (use each in turn): ${data.themes.map((t) => `${t.label} (${t.logic})`).join("; ")}.
Ad format: ${data.format}.
Variation batch: ${data.variantSeed ?? 0} — make these distinct from earlier batches.

Write ${data.count} different ad concepts. Return JSON: { "concepts": [ { "theme": one of ${data.themes.map((t) => `"${t.id}"`).join(" | ")}, "audience": one concrete audience line, "coreIdea": one sentence on why this creative works, "headline": scroll-stopping hook under 60 characters, "caption": 2-3 sentence ad caption grounded in the real insights, "cta": button text of 2-4 words, "imageBrief": one vivid art-direction sentence describing the scene to build AROUND the real product photo (setting, surface, props, lighting, colour palette) — never describe changing the product itself } ] }
Every concept must use a different scene in imageBrief and a different headline.`,
        },
      ],
    });

    const parsed = parseJsonBlock<{ concepts?: ConceptCopy[] }>(raw);
    const concepts = (Array.isArray(parsed) ? parsed : parsed.concepts) ?? [];
    if (!concepts.length) throw new Error("The AI did not return any ad concepts.");
    return concepts.slice(0, data.count);
  });

const imageInput = z.object({
  imageDataUrl: z.string().min(30),
  imageBrief: z.string().min(3),
  productName: z.string(),
  format: z.enum(["1:1", "4:5", "9:16"]),
});

export const renderAdImage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => imageInput.parse(data))
  .handler(async ({ data }): Promise<{ path: string; signedUrl: string }> => {
    const { gatewayImage } = await import("./ai-gateway.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const aspect =
      data.format === "9:16"
        ? "a tall vertical 9:16 story composition"
        : data.format === "4:5"
          ? "a 4:5 portrait feed composition"
          : "a square 1:1 feed composition";

    const prompt = `Image-to-image task: take the attached photo of ${data.productName} and re-render it into a completely new photorealistic advertising scene in ${aspect}.

LOCKED REFERENCE — the product itself: copy the physical product from the attached photo pixel-faithfully. Its silhouette, proportions, packaging artwork, logo, label typography, wording and exact colours must be preserved so a viewer instantly recognises it as the same physical item. Never redraw, restyle, re-letter, warp, blur or substitute the packaging, and never invent extra logos or text on it.

FULLY RE-RENDER EVERYTHING ELSE: build a brand-new environment — different background, surface, surrounding props, camera angle, depth of field, lighting setup, colour grade and any motion or splash elements. The result must NOT look like the original photo with a filter or a pasted cut-out; the source background, backdrop and framing must be entirely replaced, and the product must be relit and re-shadowed so it sits naturally in the new scene with physically correct contact shadows and reflections.

New scene direction: ${data.imageBrief}

Studio-grade commercial photography quality, clean composition with breathing room where a headline could later be placed. Render NO added words anywhere in the image — no headline text, no captions, no watermarks, no borders. The only text allowed is the packaging text that already exists in the reference photo.`;

    const b64 = await gatewayImage(prompt, data.imageDataUrl);
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const path = `${crypto.randomUUID()}.png`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("ad-images")
      .upload(path, bytes, { contentType: "image/png", upsert: false });
    if (uploadError) throw new Error(`Could not save the generated image: ${uploadError.message}`);

    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from("ad-images")
      .createSignedUrl(path, 60 * 60 * 24 * 365);
    if (signError || !signed?.signedUrl) {
      throw new Error("Could not create a link for the generated image.");
    }

    return { path, signedUrl: signed.signedUrl };
  });

const signInput = z.object({ paths: z.array(z.string()).max(200) });

export const signAdImages = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => signInput.parse(data))
  .handler(async ({ data }): Promise<Record<string, string>> => {
    if (!data.paths.length) return {};
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed } = await supabaseAdmin.storage
      .from("ad-images")
      .createSignedUrls(data.paths, 60 * 60 * 24 * 365);

    const map: Record<string, string> = {};
    (signed ?? []).forEach((entry) => {
      if (entry.path && entry.signedUrl) map[entry.path] = entry.signedUrl;
    });
    return map;
  });
