import { cn } from "@/lib/utils";

type PandaLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = { sm: 36, md: 48, lg: 72 };

export function PandaLogo({ size = "md", className }: PandaLogoProps) {
  const s = sizes[size];
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("drop-shadow-sm", className)}
      aria-hidden
    >
      <circle cx="40" cy="42" r="28" fill="white" stroke="#10b981" strokeWidth="2" />
      <ellipse cx="22" cy="22" rx="12" ry="14" fill="#1f2937" />
      <ellipse cx="58" cy="22" rx="12" ry="14" fill="#1f2937" />
      <ellipse cx="22" cy="24" rx="7" ry="8" fill="#374151" />
      <ellipse cx="58" cy="24" rx="7" ry="8" fill="#374151" />
      <ellipse cx="30" cy="40" rx="6" ry="7" fill="#1f2937" />
      <ellipse cx="50" cy="40" rx="6" ry="7" fill="#1f2937" />
      <circle cx="32" cy="38" r="2" fill="white" />
      <circle cx="52" cy="38" r="2" fill="white" />
      <ellipse cx="40" cy="50" rx="4" ry="3" fill="#1f2937" />
      <path
        d="M34 54 Q40 58 46 54"
        stroke="#1f2937"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="40" cy="30" r="3" fill="#10b981" opacity="0.6" />
    </svg>
  );
}
