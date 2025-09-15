import { Badge } from "@/components/ui/badge";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        active: "bg-success/10 text-success hover:bg-success/20 border border-success/20",
        expired: "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20",
        renewal: "bg-warning/10 text-warning hover:bg-warning/20 border border-warning/20",
        low: "bg-success/10 text-success hover:bg-success/20 border border-success/20",
        medium: "bg-warning/10 text-warning hover:bg-warning/20 border border-warning/20",
        high: "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20",
      },
    },
    defaultVariants: {
      variant: "active",
    },
  }
);

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
}

export function StatusBadge({ className, variant, children, ...props }: StatusBadgeProps) {
  return (
    <div
      className={cn(statusBadgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Helper function to get the right variant based on status/risk
export function getStatusVariant(status: string): VariantProps<typeof statusBadgeVariants>['variant'] {
  const statusLower = status.toLowerCase();
  if (statusLower === 'active') return 'active';
  if (statusLower === 'expired') return 'expired';
  if (statusLower === 'renewal due') return 'renewal';
  return 'active';
}

export function getRiskVariant(risk: string): VariantProps<typeof statusBadgeVariants>['variant'] {
  const riskLower = risk.toLowerCase();
  if (riskLower === 'low') return 'low';
  if (riskLower === 'medium') return 'medium';
  if (riskLower === 'high') return 'high';
  return 'low';
}