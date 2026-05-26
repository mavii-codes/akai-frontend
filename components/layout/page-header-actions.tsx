import { cn } from "@/lib/utils";

type PageHeaderActionsProps = {
  children: React.ReactNode;
  className?: string;
};

/** Responsive toolbar for page headers (primary CTA + icon actions). */
export function PageHeaderActions({
  children,
  className,
}: PageHeaderActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 w-full sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-2 sm:w-auto min-w-0",
        className
      )}
    >
      {children}
    </div>
  );
}
