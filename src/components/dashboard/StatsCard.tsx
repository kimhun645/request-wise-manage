import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  className?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className,
  variant = "default" 
}: StatsCardProps) {
  const variantStyles = {
    default: "border-border bg-card",
    success: "border-success/20 bg-success/5",
    warning: "border-warning/20 bg-warning/5", 
    danger: "border-destructive/20 bg-destructive/5"
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer",
      variantStyles[variant],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={cn(
            "p-2 rounded-lg",
            variant === "success" && "bg-success/10 text-success",
            variant === "warning" && "bg-warning/10 text-warning",
            variant === "danger" && "bg-destructive/10 text-destructive",
            variant === "default" && "bg-primary/10 text-primary"
          )}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mb-2">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center text-xs">
            <span className={cn(
              "font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-muted-foreground ml-1">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}