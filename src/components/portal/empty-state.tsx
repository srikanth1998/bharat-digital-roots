import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-brand-paper-warm/60 flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-brand-ink/50" />
        </div>
      )}
      <p className="font-serif text-lg text-brand-ink">{title}</p>
      {description && <p className="mt-1 text-sm text-brand-ink/60 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 rounded-md bg-brand-paper-warm/50 animate-pulse" />
      ))}
    </div>
  );
}

export function LoadingCard() {
  return <div className="h-40 rounded-xl bg-brand-paper-warm/50 animate-pulse" />;
}
