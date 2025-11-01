import React from "react";

interface IconProps {
  className?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

// Drag Handle Icon (6 dots)
export const DragHandleIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
  fill = "currentColor",
}) => {
  return (
    <svg
      className={className}
      fill={fill}
      viewBox="0 0 24 24"
      aria-label="Drag to reorder"
    >
      <circle cx="9" cy="5" r="1.5" />
      <circle cx="15" cy="5" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="15" cy="19" r="1.5" />
    </svg>
  );
};

// Mappings Icon (swap arrows)
export const MappingsIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
}) => {
  return (
    <svg className={className} fill={fill} viewBox="0 0 24 24" stroke={stroke}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    </svg>
  );
};

// Arrow Right Icon
export const ArrowRightIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
}) => {
  return (
    <svg className={className} fill={fill} viewBox="0 0 24 24" stroke={stroke}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  );
};

// Chevron Up Icon
export const ChevronUpIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
}) => {
  return (
    <svg fill={fill} viewBox="0 0 24 24" stroke={stroke} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M5 15l7-7 7 7"
      />
    </svg>
  );
};

// Chevron Down Icon
export const ChevronDownIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
}) => {
  return (
    <svg fill={fill} viewBox="0 0 24 24" stroke={stroke} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
};

// Edit Icon (pencil)
export const EditIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
}) => {
  return (
    <svg fill={fill} viewBox="0 0 24 24" stroke={stroke} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
};

// Delete Icon (trash)
export const DeleteIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
}) => {
  return (
    <svg fill={fill} viewBox="0 0 24 24" stroke={stroke} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
};

// Plus Icon
export const PlusIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
}) => {
  return (
    <svg className={className} fill={fill} viewBox="0 0 24 24" stroke={stroke}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
};

// Clipboard Icon
export const ClipboardIcon: React.FC<IconProps> = ({
  className = "h-12 w-12",
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
}) => {
  return (
    <svg className={className} fill={fill} viewBox="0 0 24 24" stroke={stroke}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  );
};

// Close/X Icon
export const CloseIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
}) => {
  return (
    <svg className={className} fill={fill} viewBox="0 0 24 24" stroke={stroke}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

// Close Icon for Modal (smaller variant)
export const ModalCloseIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
}) => {
  return (
    <svg className={className} fill={fill} viewBox="0 0 14 14" stroke={stroke}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
      />
    </svg>
  );
};

// Undo Icon
export const UndoIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
}) => {
  return (
    <svg className={className} fill={fill} viewBox="0 0 24 24" stroke={stroke}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
      />
    </svg>
  );
};

// Redo Icon
export const RedoIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
}) => {
  return (
    <svg className={className} fill={fill} viewBox="0 0 24 24" stroke={stroke}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
      />
    </svg>
  );
};
