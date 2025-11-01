"use client";

import React, { useEffect } from "react";
import { IconButton } from "./IconButton";
import { ModalCloseIcon } from "../../components/Icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) => {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 transition-opacity" />

      {/* Modal Container */}
      <div
        className={`relative z-50 w-full ${sizeClasses[size]} max-h-[calc(100vh-2rem)]`}
      >
        {/* Modal Content */}
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden flex flex-col max-h-full">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200">
            <h3
              id="modal-title"
              className="text-xl font-semibold text-gray-900"
            >
              {title}
            </h3>
            <IconButton
              variant="secondary"
              size="sm"
              onClick={onClose}
              aria-label="Close modal"
              icon={<ModalCloseIcon className="w-4 h-4" />}
            />
          </div>

          {/* Modal Body */}
          <div className="p-4 md:p-5 overflow-y-auto flex-1">{children}</div>

          {/* Modal Footer */}
          {footer && (
            <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
