import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
      {action && (
        <Link
          href={action.href}
          className="text-primary inline-flex shrink-0 items-center gap-1 text-sm font-medium hover:underline"
        >
          {action.label}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
