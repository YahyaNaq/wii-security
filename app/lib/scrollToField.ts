export function scrollToField(name: string) {
  const named = document.getElementsByName(name)[0] as HTMLElement | undefined;
  if (!named) return;

  const container = (named.closest("fieldset") ?? named.closest("label") ?? named) as HTMLElement;
  container.scrollIntoView({ behavior: "smooth", block: "center" });

  const isHiddenInput = named.tagName === "INPUT" && (named as HTMLInputElement).type === "hidden";
  const focusable = isHiddenInput
    ? container.querySelector<HTMLElement>('button, input:not([type="hidden"]), [tabindex]:not([tabindex="-1"])')
    : named;
  focusable?.focus?.({ preventScroll: true });
}
