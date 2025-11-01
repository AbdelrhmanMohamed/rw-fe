import React from "react";
import { Button } from "./Button";

interface IconButtonProps {
  variant?: "primary" | "secondary" | "danger" | "success";
  disabled?: boolean;
  onClick?: () => void;
  "aria-label": string;
  icon: React.ReactNode;
  className?: string;
  title?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  variant = "secondary",
  disabled = false,
  onClick,
  "aria-label": ariaLabel,
  icon,
  className = "",
  title,
}) => {
  const variantMap = {
    primary: "primary",
    secondary: "secondary",
    danger: "danger",
    success: "success",
  } as const;

  return (
    <Button
      variant={variantMap[variant]}
      size="icon"
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`p-2 flex items-center justify-center ${className}`}
      title={title}
    >
      <div className="w-4 h-4">{icon}</div>
    </Button>
  );
};
