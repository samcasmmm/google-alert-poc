import { z } from "zod";

export const DEFAULT_MODEL = "openai/gpt-oss-120b";
/** Shown as suggestions in settings; any model id your key can use works. */
export const SUGGESTED_MODELS = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"];
export const DEFAULT_MAX_ITEMS = 12;

/**
 * Company & product context sent to Groq so it can pick relevant stories and
 * explain concretely why each one matters to *this* company.
 */
export const BRIEF_FIELDS = [
  {
    key: "company",
    label: "Company or product name",
    placeholder: "Acme Pay",
    hint: "Used on the title slide and in the summaries.",
    maxLength: 100,
    rows: 1,
  },
  {
    key: "product",
    label: "What you build",
    placeholder: "Checkout and subscription billing API for mid-size e-commerce brands in India and SE Asia.",
    hint: "One or two sentences.",
    maxLength: 600,
    rows: 2,
  },
  {
    key: "customers",
    label: "Customers & market",
    placeholder: "D2C fashion and electronics brands, 50–500 employees; buyers are CTOs and finance leads.",
    hint: "Who buys and uses it, and in which industries or regions.",
    maxLength: 400,
    rows: 2,
  },
  {
    key: "competitors",
    label: "Competitors to watch",
    placeholder: "Stripe, Razorpay, Chargebee, Paddle",
    hint: "Comma-separated is fine.",
    maxLength: 400,
    rows: 1,
  },
  {
    key: "priorities",
    label: "Current priorities",
    placeholder: "Launching UPI AutoPay, SOC 2 audit in Q1, reducing failed payments, entering Indonesia.",
    hint: "What the team is working on or worried about right now.",
    maxLength: 600,
    rows: 2,
  },
] as const;

export type BriefKey = (typeof BRIEF_FIELDS)[number]["key"];

export const BriefSchema = z.object({
  company: z.string().default(""),
  product: z.string().default(""),
  customers: z.string().default(""),
  competitors: z.string().default(""),
  priorities: z.string().default(""),
});

export type Brief = z.infer<typeof BriefSchema>;

export function briefFilledCount(brief: Brief): number {
  return BRIEF_FIELDS.filter((f) => brief[f.key].trim()).length;
}

/** Settings entered on /settings and saved in IndexedDB (settings table, key "config"). */
export const AppConfigSchema = z.object({
  groqApiKey: z.string().default(""),
  /** Empty = DEFAULT_MODEL, so changing the default reaches existing users */
  groqModel: z.string().default(""),
  feeds: z.array(z.string()).default([]),
  brief: BriefSchema.default(BriefSchema.parse({})),
  maxItems: z.number().int().min(5).max(20).default(DEFAULT_MAX_ITEMS),
  /** IANA zone that defines "today"; empty = this browser's zone */
  timeZone: z.string().default(""),
  slideLayout: z.enum(["editorial", "poster", "briefing"]).catch("editorial").default("editorial"),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;
export type SlideLayout = AppConfig["slideLayout"];

export const SLIDE_LAYOUT_OPTIONS: { value: SlideLayout; label: string; description: string }[] = [
  { value: "editorial", label: "Editorial", description: "Newspaper front page: serif headlines, ruled kicker, quiet." },
  { value: "poster", label: "Poster", description: "Oversized type and a giant story number. Loud, readable from afar." },
  { value: "briefing", label: "Briefing", description: "Two-column grid: meta on the left, story and callout on the right." },
];

export const DEFAULT_CONFIG: AppConfig = AppConfigSchema.parse({});

/** Models Groq has retired; saved configs using them fall back to the default. */
export const RETIRED_MODELS = new Set(["llama-3.3-70b-versatile"]);

export function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const briefText = (max: number) =>
  z
    .string()
    .optional()
    .transform((s) => s?.trim().slice(0, max) || undefined);

/** What the browser sends to POST /api/news. */
export const NewsRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  feeds: z.array(z.string().refine(isHttpUrl, "Feeds must be http(s) URLs")).min(1).max(30),
  groqApiKey: z.string().max(200).optional(),
  groqModel: z.string().max(100).optional(),
  brief: z
    .object({
      company: briefText(100),
      product: briefText(600),
      customers: briefText(400),
      competitors: briefText(400),
      priorities: briefText(600),
    })
    .optional(),
  maxItems: z.number().int().min(5).max(20).optional(),
});

export type NewsRequest = z.input<typeof NewsRequestSchema>;
export type ParsedNewsRequest = z.output<typeof NewsRequestSchema>;
