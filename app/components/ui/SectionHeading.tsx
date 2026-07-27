import { cn } from "./cn";
import Eyebrow from "./Eyebrow";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  constrain = centered,
  className,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  centered?: boolean;
  constrain?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        centered && "text-center",
        constrain && "mx-auto max-w-2xl",
        className
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-display text-3xl text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-sm leading-6 text-foreground/60">
          {description}
        </p>
      )}
    </div>
  );
}
