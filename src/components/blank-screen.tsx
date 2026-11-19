/** Full-height placeholder while IndexedDB / config load (avoids layout flash). */
export function BlankScreen() {
  return <div className="min-h-dvh bg-paper" aria-busy="true" />;
}
