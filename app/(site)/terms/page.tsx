import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | WII Security",
  description: "Terms and conditions for booking WII Security's event security and photography services.",
};

const sections = [
  {
    title: "Payment Policy",
    bullets: [
      "50% advance payment is required at the time of booking. (non-refundable)",
      "The remaining 50% must be paid just before the event day, or on the event day as soon as volunteers arrive.",
      "If payment is not transferred online upon arrival, volunteers will not begin work.",
      "WII Security reserves the right to cancel the service if payment terms are not fulfilled.",
      "For service extending beyond committed time, we will charge extra. If event time exceeds 12 am then, we will charge extra i.e 500 rs for every 15 mins.",
    ],
  },
  {
    title: "Conduct & Coordination",
    bullets: [
      "Clients must ensure volunteers are guided to the correct venue and treated respectfully at all times.",
      "Volunteers are assigned for privacy monitoring and are not responsible for any other event-related duties.",
      "If you are facing any issues with photographer or videographer or not satisfied with pictures clicked, please speak up at that moment because a lot of things can't be edited later.",
    ],
  },
  {
    title: "Scope of Service",
    bullets: [
      "Volunteers will perform their best to prevent unauthorized photography or filming.",
      "Photography will be done with consent of family if female photographer hired.",
      "In case of guest resistance or conflict, the client is responsible for resolving the issue.",
      "WII Security will not be held liable for situations beyond the control of its volunteers.",
    ],
  },
  {
    title: "Event Ethics",
    bullets: [
      "WII Security does not attend events that include music, mixed gatherings, or un-Islamic practices.",
      "Any false information or misrepresentation regarding the nature of the event will lead to immediate termination of service, and the matter will be dealt with seriousness.",
    ],
  },
];

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-dark">
        T&amp;C
      </span>
      <h1 className="mt-4 font-display text-3xl text-foreground sm:text-4xl">
        Client Terms &amp; Conditions
      </h1>

      <div className="mt-10 space-y-8">
        {sections.map((section, i) => (
          <div key={section.title}>
            <h2 className="font-display text-xl text-brand-dark">
              {i + 1}. {section.title}
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-brand-dark">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="text-sm leading-6 text-foreground/70">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm leading-6 text-foreground/70">
        By filling out the form and providing your event details, you confirm that you have
        read, understood, and agreed to the above terms and conditions.
      </p>
    </section>
  );
}
