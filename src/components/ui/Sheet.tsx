"use client";
import React, { useEffect } from "react";

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  children: React.ReactNode;
  side?: "left" | "right";
  width?: string; // Tailwind width class (e.g. "w-96" or "w-[400px]")
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  side = "right",
  width = "w-96",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      {/* <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      /> */}

      {/* Drawer / Sheet */}
      <div
        className={`fixed top-0 ${side}-0 h-screen bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${width} ${
          isOpen
            ? "translate-x-0"
            : side === "right"
            ? "translate-x-full"
            : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
};
