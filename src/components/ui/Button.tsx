"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "bg-slate-100 border border-slate-200 text-black hover:bg-slate-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-500 text-white hover:bg-green-600",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-1 text-base",
    lg: "px-4 py-2 text-lg",
    icon: "p-1 text-xs",
  };

  const baseClasses =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 min-h-8";

  const combinedClasses =
    `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
