import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

export function Price({
  price,
  fullPrice,
  className,
  size = "md",
}: {
  price: number;
  fullPrice?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const hasDiscount = !!fullPrice && fullPrice > price;
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  } as const;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-bold text-price", sizes[size])}>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(fullPrice!)}
        </span>
      )}
    </div>
  );
}
