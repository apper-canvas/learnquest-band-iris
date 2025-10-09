import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  ...props 
}, ref) => {
  const baseStyles = "bg-surface rounded-2xl shadow-card transition-all duration-200";
  
  const variants = {
    default: "p-6",
    compact: "p-4",
    spacious: "p-8",
    interactive: "p-6 hover:shadow-lift hover:scale-[1.02] cursor-pointer"
  };
  
  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;