'use client';
import { cn } from "@/lib/utils";

const Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="54"
    height="54"
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <ellipse cx="27" cy="27" rx="12" ry="24" transform="rotate(45 27 27)" stroke="currentColor" strokeWidth="3"/>
    <ellipse cx="27" cy="27" rx="12" ry="24" transform="rotate(-45 27 27)" stroke="currentColor" strokeWidth="3"/>
  </svg>
);


export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Icon className="h-10 w-10 text-accent" />
      <p className="font-bold text-foreground/80 leading-[0.7]">
        Simple, Safe
        <br />
        Insurance for
        <br />
        everyone.
      </p>
    </div>
  );
}

export { Icon };
