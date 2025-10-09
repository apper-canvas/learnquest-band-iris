import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  className, 
  variant = "primary",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold";
  
  const variants = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-yellow-800",
    success: "bg-success/10 text-green-800",
    info: "bg-info/10 text-blue-800"
  };
  
  return (
    <span
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;