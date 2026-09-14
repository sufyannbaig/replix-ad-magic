import chocolateRaspberry from "@/assets/product-chocolate-raspberry.jpg";
import vanillaCream from "@/assets/product-vanilla-cream.jpg";
import cookieDough from "@/assets/product-cookie-dough.jpg";
import whiteMocha from "@/assets/product-white-mocha.jpg";
import scene1 from "@/assets/ad-scene-1.jpg";
import scene2 from "@/assets/ad-scene-2.jpg";
import scene3 from "@/assets/ad-scene-3.jpg";
import scene4 from "@/assets/ad-scene-4.jpg";
import scene5 from "@/assets/ad-scene-5.jpg";
import scene6 from "@/assets/ad-scene-6.jpg";
import scene7 from "@/assets/ad-scene-7.jpg";
import scene8 from "@/assets/ad-scene-8.jpg";
import scene9 from "@/assets/ad-scene-9.jpg";
import scene10 from "@/assets/ad-scene-10.jpg";

export const adScenes = [
  { src: scene1, label: "Sunlit marble counter" },
  { src: scene2, label: "Navy plinth spotlight" },
  { src: scene3, label: "Macro pour splash" },
  { src: scene4, label: "In-hand kitchen moment" },
  { src: scene5, label: "Old way vs new way" },
  { src: scene6, label: "Teal wall, hard shadow" },
  { src: scene7, label: "Off-white overhead flat lay" },
  { src: scene8, label: "Desk morning routine" },
  { src: scene9, label: "Collection pedestal" },
  { src: scene10, label: "Cozy evening pour" },
];

export type Platform = "instagram" | "facebook";
export type AdFormat = "1:1" | "4:5" | "9:16";

export type ThemeId =
  | "before-after"
  | "bold-claim"
  | "feature-benefit"
  | "headline"
  | "offer-sale"
  | "problem-solution"
  | "showcase"
  | "stats"
  | "testimonial"
  | "us-vs-them";
export type ObjectiveId = "launch" | "sale" | "collection" | "awareness" | "retargeting";

export const objectives: { id: ObjectiveId; label: string; blurb: string }[] = [
  { id: "launch", label: "Product Launch", blurb: "Introduce it like it's news" },
  { id: "sale", label: "Sale / Discount", blurb: "Give a reason to move now" },
  { id: "collection", label: "New Collection", blurb: "Sell the set, not the single" },
  { id: "awareness", label: "Brand Awareness", blurb: "Be remembered, not just clicked" },
  { id: "retargeting", label: "Retargeting", blurb: "Close the ones who almost bought" },
];

export const themes: { id: ThemeId; label: string; logic: string }[] = [
  { id: "before-after", label: "Before & After", logic: "Show the change, not the claim" },
  { id: "bold-claim", label: "Bold Claim", logic: "One big promise, said plainly" },
  { id: "feature-benefit", label: "Feature & Benefit", logic: "Turn specs into reasons to buy" },
  { id: "headline", label: "Headline", logic: "One line does all the work" },
  { id: "offer-sale", label: "Offer & Sale", logic: "Give a reason to move now" },
  { id: "problem-solution", label: "Problem & Solution", logic: "Name the pain, then fix it" },
  { id: "showcase", label: "Product Showcase", logic: "Let the product be the hero" },
  { id: "stats", label: "Statistics & Social Proof", logic: "Borrow trust from numbers" },
  { id: "testimonial", label: "Testimonial", logic: "Let a happy customer sell it" },
  { id: "us-vs-them", label: "Us and Them", logic: "Position against the old way" },
];

export const formats: { id: AdFormat; label: string }[] = [
  { id: "1:1", label: "1:1 Feed" },
  { id: "4:5", label: "4:5 Portrait" },
  { id: "9:16", label: "9:16 Story" },
];

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  rank: number;
  bestSellerNote: string;
  tagline: string;
  insights: string[];
  audiences: string[];
  stat: string;
  quote: string;
  quoteAuthor: string;
  oldWay: string;
  hook: string[];
  captionLead: string;
};

export const store = {
  name: "Zaffo Coffee",
  domain: "zaffo-coffee.myshopify.com",
  category: "Coffee concentrate",
};

export const user = {
  name: "Sufyan",
  fullName: "Sufyan Baig",
  email: "sufyan@zaffocoffee.com",
  initials: "SB",
  plan: "Free",
};

export const credits = { used: 0, total: 100, remaining: 100 };

export const products: Product[] = [
  {
    id: "chocolate-raspberry-truffle",
    name: "Chocolate Raspberry Truffle",
    price: 35.99,
    image: chocolateRaspberry,
    rank: 1,
    bestSellerNote: "#1 best seller · 34% of orders",
    tagline: "Dark cocoa, ripe raspberry, zero fuss",
    insights: [
      "Dessert-coded flavour, but it's a 15-second pour — the convenience angle is stronger than the indulgence angle.",
      "Cold-extracted for 18 hours with real cocoa and freeze-dried raspberry, so the fruit note reads bright, not syrupy.",
      "Best-fit audience: 25–40 women who buy iced lattes 4+ times a week and are quietly tired of the $7 receipt.",
      "Photographs richest against warm neutrals — deep berry tones pop hardest on off-white and cream sets.",
    ],
    audiences: [
      "Women 25–40, daily iced-latte buyers in US metros",
      "Dessert-coffee lovers who follow baking and café accounts",
      "Work-from-home professionals, 9–11am purchase window",
    ],
    stat: "9 out of 10 tasters picked it over their usual flavoured latte",
    quote:
      "I cancelled my morning café run. This tastes like the drink I used to pay $7 for, and it takes me twenty seconds.",
    quoteAuthor: "Marisa L., verified buyer",
    oldWay: "a queue, a barista, and a $7 flavoured latte",
    hook: [
      "Dessert in a glass. Ready in 15 seconds.",
      "The $7 latte has a rival, and it lives in your fridge.",
      "Cocoa and raspberry, cold-extracted for 18 hours.",
      "16 dessert lattes. One bottle. No machine.",
      "The flavour 34% of our orders come back for.",
    ],
    captionLead: "Chocolate Raspberry Truffle concentrate",
  },
  {
    id: "iced-vanilla-cream-drizzle",
    name: "Iced Vanilla Cream Drizzle",
    price: 35.99,
    image: vanillaCream,
    rank: 2,
    bestSellerNote: "#2 best seller · highest repeat rate",
    tagline: "Soft vanilla, cold cream, everyday easy",
    insights: [
      "This is the gateway flavour — least polarising of the four, so it's the right one to put in front of cold audiences.",
      "Real Madagascar vanilla extract instead of flavour syrup, which is the claim worth putting on the image itself.",
      "Best-fit audience: first-time concentrate buyers who describe themselves as 'not a black coffee person'.",
      "Highest repeat purchase rate in the catalogue — retargeting past buyers with a subscription nudge should outperform new-customer ads.",
    ],
    audiences: [
      "First-time iced-coffee-at-home buyers, 22–35",
      "Sweet-coffee drinkers who avoid bitter espresso",
      "Repeat customers ready for a subscription offer",
    ],
    stat: "Repeat-purchase rate of 62% — our most re-ordered flavour",
    quote:
      "I'm not a black coffee person and this is the first at-home iced coffee I actually finished. I'm on my fourth bottle.",
    quoteAuthor: "Dani R., verified buyer",
    oldWay: "syrup pumps and a fridge full of half-finished creamers",
    hook: [
      "Real vanilla. Not vanilla syrup.",
      "Your first iced coffee that doesn't taste like a compromise.",
      "Pour, stir, done. Cream drizzle optional (it isn't).",
      "62% of people who try it buy it again.",
      "Iced coffee for people who don't like coffee bitter.",
    ],
    captionLead: "Iced Vanilla Cream Drizzle concentrate",
  },
  {
    id: "cookie-dough",
    name: "Cookie Dough",
    price: 35.99,
    image: cookieDough,
    rank: 3,
    bestSellerNote: "#3 best seller · strongest on Reels",
    tagline: "Brown butter sweetness with a real coffee spine",
    insights: [
      "The name does the scroll-stopping, so the creative should lead with the pour, not with explanation.",
      "Toasted brown-sugar and cocoa-nib notes over a 100% arabica base — sweet on the front, still coffee on the finish.",
      "Best-fit audience: 18–29 afternoon-slump drinkers who treat coffee as a snack, not a ritual.",
      "Over-indexes on short video, so a 9:16 cut of the pour should be in every batch for this product.",
    ],
    audiences: [
      "Gen Z snack-coffee drinkers, 18–29",
      "Afternoon-slump buyers, 2–4pm engagement peak",
      "Short-video audiences who follow food trend accounts",
    ],
    stat: "Sold out twice in 2025 — 4,100 bottles in eleven weeks",
    quote:
      "It genuinely tastes like the spoon you steal from the mixing bowl, except it's coffee and it wakes me up.",
    quoteAuthor: "Theo M., verified buyer",
    oldWay: "a vending-machine candy bar and a lukewarm drip coffee",
    hook: [
      "Cookie dough, but it's your 3pm coffee.",
      "Sweet enough to be a treat. Strong enough to be coffee.",
      "The flavour that sold out twice.",
      "Your 3pm slump has met its match.",
      "Tastes like the spoon from the mixing bowl.",
    ],
    captionLead: "Cookie Dough concentrate",
  },
  {
    id: "white-chocolate-mocha",
    name: "White Chocolate Mocha",
    price: 35.99,
    image: whiteMocha,
    rank: 4,
    bestSellerNote: "#4 best seller · gifting favourite",
    tagline: "Ivory chocolate, deep espresso, café-shaped",
    insights: [
      "This is the café-replacement flavour — people search it by the drink name, so the ad copy should use that exact language.",
      "Cocoa-butter white chocolate blended into an espresso-forward base, which is why it holds up hot as well as iced.",
      "Best-fit audience: 28–45 buyers who order the same café drink every week and gift coffee at the holidays.",
      "Works hot, so it's the one flavour with a genuine cold-weather and gifting season on top of iced demand.",
    ],
    audiences: [
      "Loyal café-drink regulars, 28–45",
      "Gift buyers in the Oct–Dec window",
      "Hot-and-iced drinkers in colder states",
    ],
    stat: "Rated 4.9/5 across 812 reviews",
    quote:
      "It's the exact drink I order every Friday, except I make it at home in a mug at 6am before anyone is awake.",
    quoteAuthor: "Priya S., verified buyer",
    oldWay: "a drive-thru detour and a name spelled wrong on a cup",
    hook: [
      "Your Friday café order, on a Tuesday, at home.",
      "White chocolate mocha without the drive-thru.",
      "4.9 out of 5, across 812 reviews.",
      "Same drink. No queue, no misspelled cup.",
      "Works hot. Works iced. Works at 6am.",
    ],
    captionLead: "White Chocolate Mocha concentrate",
  },
];

export const productById = (id: string) => products.find((p) => p.id === id);

/** Short sell copy laid over the ad image as a sharp HTML/CSS text layer. */
export type AdOverlay = {
  hero: string;
  support?: string;
  attribution?: string;
  badge?: string;
};

export type Ad = {
  id: string;
  productId: string;
  productName: string;
  platform: Platform;
  format: AdFormat;
  theme: ThemeId;
  objective: ObjectiveId;
  /** Displayable image URL; empty while the image is still being generated. */
  image: string;
  /** Storage path of the generated image, when it is a real generated ad. */
  imagePath?: string;
  /** "shopify" for catalogue products, "upload" for a customer-supplied photo. */
  source?: string;
  audience: string;
  coreIdea: string;
  headline: string;
  caption: string;
  cta: string;
  overlay?: AdOverlay;
  favorite: boolean;
  createdAt: string;
  collectionIds: string[];
};

export type CollectionColor = "gray" | "yellow" | "pink" | "teal";

export const collectionColors: { id: CollectionColor; label: string; swatch: string }[] = [
  { id: "gray", label: "Grey", swatch: "#D5D6D8" },
  { id: "yellow", label: "Yellow", swatch: "#F8DC94" },
  { id: "pink", label: "Pink", swatch: "#F7CDEC" },
  { id: "teal", label: "Teal", swatch: "#A7E4CF" },
];

export type Collection = {
  id: string;
  name: string;
  description: string;
  color: CollectionColor;
};

export const collections: Collection[] = [
  {
    id: "summer-iced-push",
    name: "Summer Iced Push",
    description: "Warm-weather creatives leading with the 15-second pour",
    color: "gray",
  },
  {
    id: "proof-that-converts",
    name: "Proof That Converts",
    description: "Review-led and stats-led ads for cold traffic",
    color: "yellow",
  },
];

const seed = (
  i: number,
  productId: string,
  platform: Platform,
  format: AdFormat,
  theme: ThemeId,
  objective: ObjectiveId,
  scene: number,
  audience: string,
  coreIdea: string,
  headline: string,
  caption: string,
  cta: string,
  favorite: boolean,
  createdAt: string,
  collectionIds: string[],
): Ad => ({
  id: `seed-${i}`,
  productId,
  productName: productById(productId)!.name,
  platform,
  format,
  theme,
  objective,
  image: adScenes[scene]!.src,
  audience,
  coreIdea,
  headline,
  caption,
  cta,
  favorite,
  createdAt,
  collectionIds,
});

export const seededAds: Ad[] = [
  seed(
    1,
    "chocolate-raspberry-truffle",
    "instagram",
    "4:5",
    "showcase",
    "launch",
    0,
    "Women 25–40, daily iced-latte buyers in US metros",
    "Make the pour itself the proof that this is easier than a café run.",
    "Dessert in a glass. Ready in 15 seconds.",
    "Cold-extracted 18 hours with real cocoa and raspberry. One bottle makes 16 iced lattes — no machine, no queue, no $7 receipt.",
    "Shop the flavour",
    true,
    "Aug 28, 2026",
    ["summer-iced-push"],
  ),
  seed(
    2,
    "chocolate-raspberry-truffle",
    "facebook",
    "1:1",
    "stats",
    "awareness",
    6,
    "Cold audiences who have never bought concentrate",
    "Lead with the blind-taste number so a stranger has a reason to keep reading.",
    "9 out of 10 tasters picked it over their usual latte",
    "We ran a blind taste test against the flavoured lattes people already buy every morning. The concentrate won 9 times out of 10.",
    "See why",
    false,
    "Aug 26, 2026",
    ["proof-that-converts"],
  ),
  seed(
    3,
    "iced-vanilla-cream-drizzle",
    "instagram",
    "1:1",
    "showcase",
    "launch",
    1,
    "First-time iced-coffee-at-home buyers, 22–35",
    "Show the two-step ritual so the whole product is understood in one frame.",
    "Real vanilla. Not vanilla syrup.",
    "Madagascar vanilla, cold-extracted coffee, cold milk. That's the recipe and that's the whole method.",
    "Try the easy one",
    true,
    "Aug 24, 2026",
    ["summer-iced-push"],
  ),
  seed(
    4,
    "iced-vanilla-cream-drizzle",
    "facebook",
    "4:5",
    "testimonial",
    "retargeting",
    3,
    "Repeat customers ready for a subscription offer",
    "Let the fourth-bottle customer answer the hesitation for us.",
    "\"I'm on my fourth bottle.\"",
    "\"I'm not a black coffee person and this is the first at-home iced coffee I actually finished.\" — Dani R., verified buyer. 62% of buyers re-order.",
    "Re-order now",
    false,
    "Aug 22, 2026",
    ["proof-that-converts"],
  ),
  seed(
    5,
    "cookie-dough",
    "instagram",
    "9:16",
    "showcase",
    "sale",
    2,
    "Gen Z snack-coffee drinkers, 18–29",
    "The pour is the hook — no explanation, just the swirl and the name.",
    "Cookie dough, but it's your 3pm coffee.",
    "Toasted brown sugar, cocoa nibs, 100% arabica underneath. Sweet on the front, still coffee on the finish. 20% off this week.",
    "Grab 20% off",
    true,
    "Aug 20, 2026",
    ["summer-iced-push"],
  ),
  seed(
    6,
    "cookie-dough",
    "facebook",
    "1:1",
    "stats",
    "sale",
    9,
    "Afternoon-slump buyers, 2–4pm engagement peak",
    "Scarcity is real here — say it plainly and let the number carry the urgency.",
    "Sold out twice. 4,100 bottles in eleven weeks.",
    "Cookie Dough concentrate is back in stock and we don't expect it to stay that way. 20% off while it lasts.",
    "Shop before it's gone",
    false,
    "Aug 18, 2026",
    ["proof-that-converts"],
  ),
  seed(
    7,
    "white-chocolate-mocha",
    "instagram",
    "4:5",
    "us-vs-them",
    "awareness",
    4,
    "Loyal café-drink regulars, 28–45",
    "Put the drive-thru detour next to the six-second pour and let the contrast argue.",
    "Your Friday café order, on a Tuesday, at home.",
    "One side: a detour, a queue and your name spelled wrong. Other side: a bottle in your fridge. Same drink.",
    "Skip the drive-thru",
    false,
    "Aug 16, 2026",
    [],
  ),
  seed(
    8,
    "white-chocolate-mocha",
    "facebook",
    "1:1",
    "testimonial",
    "retargeting",
    7,
    "Hot-and-iced drinkers in colder states",
    "Use the 6am-at-home detail — it's the moment the product actually wins.",
    "\"I make it at home in a mug at 6am.\"",
    "\"It's the exact drink I order every Friday.\" — Priya S. Rated 4.9/5 across 812 reviews. Works hot or iced.",
    "Read the reviews",
    true,
    "Aug 14, 2026",
    ["proof-that-converts"],
  ),
  seed(
    9,
    "chocolate-raspberry-truffle",
    "instagram",
    "1:1",
    "us-vs-them",
    "collection",
    8,
    "Dessert-coffee lovers who follow baking and café accounts",
    "Sell the shelf, not the single bottle — the set is the upgrade.",
    "Four flavours. Zero barista.",
    "The full Zaffo shelf: Chocolate Raspberry Truffle, Vanilla Cream, Cookie Dough, White Chocolate Mocha. $35.99 each, 16 drinks per bottle.",
    "Shop the collection",
    false,
    "Aug 11, 2026",
    ["summer-iced-push"],
  ),
  seed(
    10,
    "iced-vanilla-cream-drizzle",
    "instagram",
    "9:16",
    "showcase",
    "awareness",
    5,
    "Sweet-coffee drinkers who avoid bitter espresso",
    "A real face holding the drink outperforms a studio bottle on cold story traffic.",
    "The 20-second iced latte",
    "No machine. No grinder. No queue. Just concentrate, milk, ice — and a flavour that doesn't taste like syrup.",
    "Learn more",
    false,
    "Aug 8, 2026",
    [],
  ),
];

/* ---------- Simulated generation ---------- */

const audienceFor = (p: Product, i: number) => p.audiences[i % p.audiences.length]!;

const coreIdeas: Partial<Record<ThemeId, (p: Product) => string[]>> = {
  showcase: (p) => [
    `Let the pour do the talking — ${p.tagline.toLowerCase()} in a single unbroken frame.`,
    `Frame the bottle as the hero object and keep the copy to one promise: ${p.tagline.toLowerCase()}.`,
    `Show the finished drink first, the bottle second, so the reward lands before the explanation.`,
  ],
  stats: (p) => [
    `Open on the number — "${p.stat}" — and let credibility do the persuading.`,
    `Put the proof point in the image itself so it survives a silent, sound-off scroll.`,
    `Stack one hard number against one soft benefit so the claim feels measured, not loud.`,
  ],
  testimonial: (p) => [
    `Hand the argument to ${p.quoteAuthor} and stay out of the way.`,
    `Use the customer's exact words as the headline — unpolished language reads as real.`,
    `Pair a real face with a real sentence so the review feels witnessed, not written.`,
  ],
  "us-vs-them": (p) => [
    `Put ${p.oldWay} next to a six-second pour and let the contrast make the case.`,
    `Name the old way plainly, then show the new way costing nothing but a stir.`,
    `Frame the competitor as the habit, not the brand — habits are easier to beat.`,
  ],
};

const objectiveTail: Record<ObjectiveId, string> = {
  launch: "Just landed at Zaffo Coffee.",
  sale: "20% off this week only.",
  collection: "Now part of the full four-flavour shelf.",
  awareness: "One bottle makes 16 drinks.",
  retargeting: "You left this in your cart — it's still in stock.",
};

const ctas: Record<ObjectiveId, string[]> = {
  launch: ["Shop the launch", "Try it first", "Get the new flavour"],
  sale: ["Grab 20% off", "Claim the discount", "Shop the sale"],
  collection: ["Shop the collection", "See all four", "Build your shelf"],
  awareness: ["Learn more", "See how it works", "Meet Zaffo"],
  retargeting: ["Complete your order", "Back to your cart", "Finish checkout"],
};

const captionOpeners: Partial<Record<ThemeId, (p: Product) => string>> = {
  showcase: (p) => `${p.captionLead}: ${p.tagline.toLowerCase()}.`,
  stats: (p) => `${p.stat}.`,
  testimonial: (p) => `"${p.quote}" — ${p.quoteAuthor}.`,
  "us-vs-them": (p) => `Old way: ${p.oldWay}. New way: pour, stir, drink.`,
};

export type GenerateInput = {
  productId: string;
  objective: ObjectiveId;
  themeIds: ThemeId[];
  format: AdFormat;
  count: number;
  offset?: number;
};

export function generateConcepts(input: GenerateInput): Ad[] {
  const product = productById(input.productId)!;
  const themeList = input.themeIds.length ? input.themeIds : (["showcase"] as ThemeId[]);
  const offset = input.offset ?? 0;

  return Array.from({ length: input.count }, (_, k) => {
    const i = offset + k;
    const theme = themeList[i % themeList.length]!;
    const ideas = (coreIdeas[theme] ?? coreIdeas.showcase!)(product);
    const hook = product.hook[i % product.hook.length]!;
    const scene = adScenes[(i * 3 + product.rank * 2) % adScenes.length]!;

    return {
      id: `gen-${product.id}-${theme}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      productId: product.id,
      productName: product.name,
      platform: (i % 2 === 0 ? "instagram" : "facebook") as Platform,
      format: input.format,
      theme,
      objective: input.objective,
      image: scene.src,
      audience: audienceFor(product, i),
      coreIdea: ideas[i % ideas.length]!,
      headline:
        theme === "testimonial"
          ? `"${product.quote.split(".")[0]!}."`
          : theme === "stats"
            ? product.stat
            : hook,
      caption: `${(captionOpeners[theme] ?? captionOpeners.showcase!)(product)} ${objectiveTail[input.objective]} $${product.price.toFixed(2)} — 16 drinks per bottle.`,
      cta: ctas[input.objective][i % ctas[input.objective].length]!,
      favorite: false,
      createdAt: "Just now",
      collectionIds: [],
    };
  });
}

export const understandingSteps = [
  "Reading product photo",
  "Extracting colors, materials and claims",
  "Finding the strongest selling angle",
];

export const generationSteps = [
  "Locking the selling angle",
  "Writing hook variations",
  "Art-directing each scene",
  "Rendering creatives",
  "Scoring and ranking concepts",
];
