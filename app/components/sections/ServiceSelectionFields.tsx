"use client";

import { useState } from "react";
import { TextField, RadioGroupField } from "../ui/fields";
import type { Translations } from "../../i18n/translations";
import type { ServiceOption } from "../../lib/pricing";

// Shared "choose your services" block used by both the Get-a-Quote and
// Booking forms: Phone Pouches/Monitoring (+ conditional guest count),
// Photography, and Videography. Guest count only applies to Phone Pouches
// and Monitoring, so it's hidden until one of those is selected.
export function ServiceSelectionFields({
  form,
  prefix,
  errors,
  photographyOptions,
  videographyOptions,
  defaultGuestService,
  defaultFemaleGuests,
  defaultPhotographyTier,
  defaultVideographyTier,
}: {
  form: Translations["bookCta"]["form"];
  prefix: string;
  errors: Record<string, string>;
  photographyOptions: ServiceOption[];
  videographyOptions: ServiceOption[];
  defaultGuestService?: string;
  defaultFemaleGuests?: string;
  defaultPhotographyTier?: string;
  defaultVideographyTier?: string;
}) {
  const [guestService, setGuestService] = useState(defaultGuestService ?? "");
  const needsGuestCount = guestService === "phone-pouches" || guestService === "monitoring";

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h5 className="text-sm font-medium text-foreground">{form.servicesGroupHeading}</h5>
        <p className="text-xs text-foreground/50">{form.servicesGroupNote}</p>
      </div>

      <RadioGroupField
        label={form.guestServiceLabel}
        name={`${prefix}[guestService]`}
        options={form.guestServiceOptions}
        defaultValue={defaultGuestService}
        error={errors[`${prefix}[guestService]`]}
        onChange={setGuestService}
        hideOptionalMark
      />

      {needsGuestCount && (
        <TextField
          label={form.femaleGuests}
          type="number"
          name={`${prefix}[femaleGuests]`}
          min={0}
          placeholder={form.femaleGuestsPlaceholder}
          defaultValue={defaultFemaleGuests}
          error={errors[`${prefix}[femaleGuests]`]}
          required
        />
      )}

      <RadioGroupField
        label={form.photographyTierLabel}
        name={`${prefix}[photographyTier]`}
        options={photographyOptions.map((o) => ({ value: o.slug, label: o.label }))}
        defaultValue={defaultPhotographyTier}
        error={errors[`${prefix}[photographyTier]`]}
        hideOptionalMark
      />

      <RadioGroupField
        label={form.videographyTierLabel}
        name={`${prefix}[videographyTier]`}
        options={videographyOptions.map((o) => ({ value: o.slug, label: o.label }))}
        defaultValue={defaultVideographyTier}
        error={errors[`${prefix}[videographyTier]`]}
        hideOptionalMark
      />
    </div>
  );
}
