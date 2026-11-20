"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { saveConfig } from "../config";
import { fromDraft, hasErrors, isDirty, toDraft, validateDraft, type Draft } from "../draft";
import type { AppConfig } from "../schema";
import { AiSection } from "./ai-section";
import { BriefSection } from "./brief-section";
import { BriefingSection } from "./briefing-section";
import { FeedsSection } from "./feeds-section";
import { SaveBar } from "./save-bar";

/**
 * The settings form. Edits go to a local draft; the save bar shows when it differs
 * from what is stored. Ctrl/Cmd+S saves, and leaving with unsaved edits asks first.
 */
export function ConfigFormBody({
  initial,
  savedAt,
  onSaved,
}: {
  initial: AppConfig;
  savedAt: Date | null;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(initial));
  const [saving, setSaving] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const patch = useCallback((p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p })), []);
  const dirty = useMemo(() => isDirty(draft, initial), [draft, initial]);
  const errors = useMemo(() => validateDraft(draft), [draft]);
  // Show errors once a save was attempted, or as soon as a field is clearly wrong.
  const visibleErrors = showErrors ? errors : { feeds: {}, timeZone: undefined };
  const errorCount = Object.keys(visibleErrors.feeds).length + (visibleErrors.timeZone ? 1 : 0);

  const save = useCallback(async () => {
    if (hasErrors(errors)) {
      setShowErrors(true);
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setSaving(true);
    await saveConfig(fromDraft(draft));
    setSaving(false);
    onSaved();
  }, [draft, errors, onSaved]);

  // Ctrl/Cmd+S saves.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !saving) void save();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dirty, saving, save]);

  // Warn before closing or reloading with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  return (
    <form
      ref={form}
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
      className="space-y-14"
      noValidate
    >
      <BriefSection brief={draft.brief} onChange={(brief) => patch({ brief })} />
      <FeedsSection
        rows={draft.feedRows}
        errors={visibleErrors.feeds}
        onChange={(update) => setDraft((d) => ({ ...d, feedRows: update(d.feedRows) }))}
      />
      <AiSection apiKey={draft.groqApiKey} model={draft.groqModel} onChange={patch} />
      <BriefingSection
        maxItems={draft.maxItems}
        timeZone={draft.timeZone}
        slideLayout={draft.slideLayout}
        timeZoneError={visibleErrors.timeZone}
        onChange={patch}
      />
      <SaveBar
        dirty={dirty}
        saving={saving}
        errorCount={errorCount}
        savedAt={savedAt}
        onDiscard={() => {
          setDraft(toDraft(initial));
          setShowErrors(false);
        }}
      />
    </form>
  );
}
