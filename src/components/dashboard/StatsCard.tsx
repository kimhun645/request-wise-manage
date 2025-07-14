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
    default: "neumorph hover:shadow-neumorph-hover",
    success: "neumorph text-success hover:shadow-neumorph-hover",
    warning: "neumorph text-warning hover:shadow-neumorph-hover", 
    danger: "neumorph text-destructive hover:shadow-neumorph-hover"
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:translate-y-[-2px] cursor-pointer",
      variantStyles[variant],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={cn(
            "p-2 rounded-lg neumorph-small",
            variant === "success" && "text-success",
            variant === "warning" && "text-warning",
            variant === "danger" && "text-destructive",
            variant === "default" && "text-primary"
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