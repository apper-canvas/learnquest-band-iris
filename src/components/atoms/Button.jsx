import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lift active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-pink-500 text-white shadow-card hover:from-primary hover:to-pink-600",
    secondary: "bg-gradient-to-r from-secondary to-teal-500 text-white shadow-card hover:from-secondary hover:to-teal-600",
    accent: "bg-gradient-to-r from-accent to-yellow-400 text-gray-800 shadow-card hover:from-accent hover:to-yellow-500",
    success: "bg-gradient-to-r from-success to-green-500 text-white shadow-card hover:from-success hover:to-green-600",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-primary hover:bg-primary/10"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;