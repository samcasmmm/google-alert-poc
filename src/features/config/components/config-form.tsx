"use client";

import { useState } from "react";
import { Check, Spinner } from "@/components/icons";
import { inputClass, primaryButton, secondaryButton } from "@/components/ui";
import { browserTimeZone, isValidTimeZone } from "@/lib/date";
import { saveConfig, useConfig } from "../config";
import {
  BRIEF_FIELDS,
  briefFilledCount,
  DEFAULT_MODEL,
  MAX_ITEMS,
  MIN_ITEMS,
  isHttpUrl,
  SLIDE_LAYOUT_OPTIONS,
  SUGGESTED_MODELS,
  type AppConfig,
  type Brief,
  type SlideLayout,
} from "../schema";

/** Loads saved config, then renders the form (keyed so it re-initializes after an import). */
export function ConfigForm() {
  const config = useConfig();
  if (!config) return <p className="text-muted">Loading…</p>;
  return <ConfigFormInner key={JSON.stringify(config)} initial={config} />;
}

function ConfigFormInner({ initial }: { initial: AppConfig }) {
  const [apiKey, setApiKey] = useState(initial.groqApiKey);
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState(initial.groqModel);
  const [feedsText, setFeedsText] = useState(initial.feeds.join("\n"));
  const [brief, setBrief] = useState<Brief>(initial.brief);
  const [maxItems, setMaxItems] = useState(initial.maxItems);
  const [timeZone, setTimeZone] = useState(initial.timeZone);
  const [slideLayout, setSlideLayout] = useState<SlideLayout>(initial.slideLayout);
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const feeds = feedsText
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const badFeeds = feeds.filter((f) => !isHttpUrl(f));
  const badZone = timeZone.trim() !== "" && !isValidTimeZone(timeZone.trim());

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (badFeeds.length || badZone) {
      setStatus({ tone: "error", text: "Fix the highlighted fields first." });
      document.getElementById(badFeeds.length ? "cfg-feeds" : "cfg-tz")?.focus();
      return;
    }
    setSaving(true);
    await saveConfig({
      groqApiKey: apiKey.trim(),
      groqModel: model.trim() === DEFAULT_MODEL ? "" : model.trim(),
      feeds: [...new Set(feeds)],
      brief: Object.fromEntries(Object.entries(brief).map(([k, v]) => [k, v.trim()])) as Brief,
      maxItems,
      timeZone: timeZone.trim(),
      slideLayout,
    });
    setSaving(false);
    setStatus({ tone: "ok", text: "Saved" });
  }

  return (
    <form onSubmit={onSave} className="space-y-14" onChange={() => setStatus(null)}>
      <Section
        id="brief"
        title="Company & product brief"
        description={
          <>
            Groq reads this to pick stories that matter to you and to write a specific “why it matters” for each one.
            All fields are optional; the more you fill in, the sharper the briefing.{" "}
            <span className="font-medium text-ink">
              {briefFilledCount(brief)}/{BRIEF_FIELDS.length} filled.
            </span>
          </>
        }
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {BRIEF_FIELDS.map((field) => {
            const id = `brief-${field.key}`;
            const value = brief[field.key];
            const wide = field.rows > 1;
            return (
              <div key={field.key} className={wide ? "sm:col-span-2" : ""}>
                <Field label={field.label} hint={field.hint} htmlFor={id}>
                  {field.rows > 1 ? (
                    <textarea
                      id={id}
                      value={value}
                      onChange={(e) => setBrief((b) => ({ ...b, [field.key]: e.target.value }))}
                      rows={field.rows + 1}
                      maxLength={field.maxLength}
                      placeholder={field.placeholder}
                      className={`${inputClass} resize-y leading-relaxed`}
                    />
                  ) : (
                    <input
                      id={id}
                      value={value}
                      onChange={(e) => setBrief((b) => ({ ...b, [field.key]: e.target.value }))}
                      maxLength={field.maxLength}
                      placeholder={field.placeholder}
                      autoComplete={field.key === "company" ? "organization" : "off"}
                      className={inputClass}
                    />
                  )}
                  {value.length > field.maxLength * 0.8 && (
                    <p className="mt-1 text-xs text-muted tabular-nums">
                      {value.length}/{field.maxLength}
                    </p>
                  )}
                </Field>
              </div>
            );
          })}
        </div>
      </Section>

      <Section id="sources" title="News sources">
        <div className="space-y-8">
      <Field label="RSS feeds" required hint="One URL per line: Google Alerts RSS feeds, industry blogs, etc." htmlFor="cfg-feeds">
        <textarea
          id="cfg-feeds"
          value={feedsText}
          onChange={(e) => setFeedsText(e.target.value)}
          rows={5}
          spellCheck={false}
          placeholder={"https://www.google.com/alerts/feeds/…\nhttps://techcrunch.com/feed/"}
          className={`${inputClass} font-mono text-sm ${badFeeds.length ? "border-accent" : ""}`}
          aria-invalid={badFeeds.length > 0}
          aria-describedby={badFeeds.length ? "cfg-feeds-error" : undefined}
        />
        {badFeeds.length > 0 && (
          <p id="cfg-feeds-error" className="mt-1 text-sm break-all text-accent">
            Not a valid http(s) URL: {badFeeds.join(", ")}
          </p>
        )}
      </Field>

      <Field
        label="Groq API key"
        htmlFor="cfg-key"
        hint={
          <>
            Free at{" "}
            <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="font-medium text-accent hover:underline">
              console.groq.com/keys
            </a>
            . Used only to summarize stories. Without a key, slides show feed snippets.
          </>
        }
      >
        <div className="flex gap-2">
          <input
            id="cfg-key"
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="gsk_…"
            autoComplete="off"
            spellCheck={false}
            className={`${inputClass} font-mono text-sm`}
          />
          <button type="button" onClick={() => setShowKey((s) => !s)} className={`${secondaryButton} shrink-0`}>
            {showKey ? "Hide" : "Show"}
          </button>
        </div>
      </Field>

        </div>
      </Section>

      <Section id="presentation" title="Presentation">
      <fieldset>
        <legend className="text-sm font-medium">Slide layout</legend>
        <p className="mt-0.5 text-sm text-muted">How stories look on Today. Content is the same in every layout.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {SLIDE_LAYOUT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="group cursor-pointer rounded-xl border border-line p-3 transition-colors hover:border-ink/40 has-checked:border-ink has-checked:ring-1 has-checked:ring-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
            >
              <input
                type="radio"
                name="slideLayout"
                value={option.value}
                checked={slideLayout === option.value}
                onChange={() => setSlideLayout(option.value)}
                className="sr-only"
              />
              <LayoutPreview layout={option.value} />
              <span className="mt-3 flex items-center justify-between text-sm font-semibold">
                {option.label}
                <span
                  aria-hidden
                  className="size-4 rounded-full border border-line group-has-checked:border-[5px] group-has-checked:border-ink"
                />
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">{option.description}</span>
            </label>
          ))}
        </div>
      </fieldset>
      </Section>

      <details className="rounded-xl border border-line px-4 open:pb-5">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-medium [&::-webkit-details-marker]:hidden">
          Advanced
          <span className="text-xs font-normal text-muted">
            {maxItems} stories · {model.trim() || DEFAULT_MODEL} · {timeZone.trim() || browserTimeZone()}
          </span>
        </summary>
      <div className="grid gap-6 pt-2 sm:grid-cols-3">
        <Field
          label="Stories per day"
          hint={`${MIN_ITEMS}–${MAX_ITEMS}. With several feeds, each gives its top 2–3.`}
          htmlFor="cfg-max"
        >
          <input
            id="cfg-max"
            type="number"
            min={MIN_ITEMS}
            max={MAX_ITEMS}
            value={maxItems}
            onChange={(e) =>
              setMaxItems(Math.min(MAX_ITEMS, Math.max(MIN_ITEMS, Number(e.target.value) || MIN_ITEMS)))
            }
            className={inputClass}
          />
        </Field>
        <Field label="Groq model" hint="Empty = default" htmlFor="cfg-model">
          <input
            id="cfg-model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={DEFAULT_MODEL}
            list="groq-models"
            spellCheck={false}
            className={`${inputClass} font-mono text-sm`}
          />
          <datalist id="groq-models">
            {SUGGESTED_MODELS.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </Field>
        <Field label="Time zone" hint="Empty = this browser" htmlFor="cfg-tz">
          <input
            id="cfg-tz"
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            placeholder={browserTimeZone()}
            spellCheck={false}
            aria-invalid={badZone}
            aria-describedby={badZone ? "cfg-tz-error" : undefined}
            className={`${inputClass} ${badZone ? "border-accent" : ""}`}
          />
          {badZone && (
            <p id="cfg-tz-error" className="mt-1 text-sm text-accent">
              Unknown time zone. Use an IANA name like Asia/Kolkata.
            </p>
          )}
        </Field>
      </div>
      </details>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <button type="submit" disabled={saving} className={`${primaryButton} gap-2`}>
          {saving ? <Spinner size={16} /> : status?.tone === "ok" ? <Check size={16} /> : null}
          {saving ? "Saving…" : status?.tone === "ok" ? "Saved" : "Save settings"}
        </button>
        <p role="status" aria-live="polite" className={`text-sm ${status?.tone === "error" ? "text-accent" : "text-muted"}`}>
          {status?.tone === "error" ? status.text : status ? "Stored in this browser. Go to Today to fetch news." : ""}
        </p>
      </div>
    </form>
  );
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-8">
      <h2 id={`${id}-title`} className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
        {title}
      </h2>
      {description && <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  htmlFor,
  required,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && (
          <span className="text-accent" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

/** Schematic thumbnails of each layout (interface graphics, not illustrations). */
function LayoutPreview({ layout }: { layout: SlideLayout }) {
  const bar = "rounded-sm bg-ink";
  const soft = "rounded-sm bg-line";
  return (
    <span aria-hidden className="block aspect-video overflow-hidden rounded-lg border border-line bg-paper p-3">
      {layout === "editorial" && (
        <span className="flex h-full flex-col gap-1.5">
          <span className="flex justify-between border-b border-ink pb-1">
            <span className="h-1 w-6 rounded-sm bg-accent" />
            <span className={`h-1 w-8 ${soft}`} />
          </span>
          <span className={`mt-1 h-2.5 w-11/12 ${bar}`} style={{ borderRadius: 1 }} />
          <span className={`h-2.5 w-2/3 ${bar}`} style={{ borderRadius: 1 }} />
          <span className={`mt-1 h-1 w-full ${soft}`} />
          <span className={`h-1 w-4/5 ${soft}`} />
          <span className="mt-auto flex gap-1.5">
            <span className="w-0.5 bg-accent" />
            <span className="flex flex-1 flex-col gap-1">
              <span className={`h-1 w-3/4 ${soft}`} />
              <span className={`h-1 w-1/2 ${soft}`} />
            </span>
          </span>
        </span>
      )}
      {layout === "poster" && (
        <span className="relative flex h-full flex-col gap-1.5">
          <span className="absolute -top-2 right-0 text-3xl leading-none font-black text-subtle">03</span>
          <span className={`relative mt-2 h-4 w-11/12 ${bar}`} style={{ borderRadius: 1 }} />
          <span className={`relative h-4 w-3/5 ${bar}`} style={{ borderRadius: 1 }} />
          <span className={`h-1 w-2/3 ${soft}`} />
          <span className="mt-auto h-3 w-3/4 bg-accent" />
        </span>
      )}
      {layout === "briefing" && (
        <span className="grid h-full grid-cols-[1fr_3fr] gap-2">
          <span className="flex flex-col gap-1 border-r border-line pr-2">
            <span className="h-3 w-5 rounded-sm bg-accent" />
            <span className={`h-1 w-full ${soft}`} />
            <span className={`h-1 w-3/4 ${soft}`} />
          </span>
          <span className="flex flex-col gap-1.5">
            <span className={`h-2.5 w-full ${bar}`} />
            <span className={`h-2.5 w-3/4 ${bar}`} />
            <span className={`h-1 w-full ${soft}`} />
            <span className="mt-auto h-4 w-full rounded bg-accent-soft" />
          </span>
        </span>
      )}
    </span>
  );
}
