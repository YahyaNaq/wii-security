import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | WII Security",
  description: "How WII Security protects the privacy, dignity, and comfort of guests at women-only events.",
};

const sections = [
  {
    title: "Your Privacy Matters",
    body: "WII Security is committed to protecting the privacy, dignity, and comfort of women at women-only events.",
  },
  {
    title: "No Photography & Recording",
    body: "We help enforce no-photography and no-recording policies and monitor the event to prevent unauthorized photography or filming.",
  },
  {
    title: "Phone Privacy",
    body: "Where applicable, guests’ phones may be secured in designated privacy pouches to help maintain a private environment.",
  },
  {
    title: "Female Photography",
    body: "Our photography services are provided by female photographers, with discretion and respect for guests’ privacy.",
  },
  {
    title: "Photo & Video Handling",
    body: "Media captured through our services is handled responsibly and shared only with the authorized client, unless otherwise agreed. We delete the data permanently after transferring within decided period of time with client.",
  },
  {
    title: "Event Privacy Guidelines",
    body: "For events requiring gender segregation or a music-free environment, we can guide and remind the host to establish and communicate these arrangements. These remain the host’s responsibility.",
  },
  {
    title: "Our Commitment",
    body: "Our team maintains confidentiality, discretion, modesty, and professionalism while protecting the privacy of every event we serve.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-dark">
        Privacy
      </span>
      <h1 className="mt-4 font-display text-3xl text-foreground sm:text-4xl">
        Privacy Policy
      </h1>

      <div className="mt-10 space-y-8">
        {sections.map((section, i) => (
          <div key={section.title}>
            <h2 className="font-display text-xl text-brand-dark">
              {i + 1}. {section.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-foreground/70">{section.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
