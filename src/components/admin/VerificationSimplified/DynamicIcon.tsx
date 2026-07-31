import React from "react";
import * as LucideIcons from "lucide-react";
import { CheckCircle } from "lucide-react";

export interface DynamicIconProps {
  icon?: string;
  color?: string;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  icon,
  color = "#059669",
  className = "h-7 w-7",
}) => {
  
  if (!icon || !icon.trim()) {
    return <CheckCircle className={className} style={{ color }} />;
  }

  // 2. Render raw SVG string safely inside a flex container
  if (icon.trim().startsWith("<svg")) {
    return (
      <div
        className={`${className} flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current`}
        style={{ color }}
        dangerouslySetInnerHTML={{ __html: icon }}
      />
    );
  }

  // 3. Fallback to dynamic Lucide Icon name
  const IconComponent = (LucideIcons as Record<string, unknown>)[
    icon
  ] as React.ComponentType<{ className?: string; style?: React.CSSProperties }> | undefined;

  if (
    !IconComponent ||
    (typeof IconComponent !== "object" && typeof IconComponent !== "function")
  ) {
    return <CheckCircle className={className} style={{ color }} />;
  }

  return <IconComponent className={className} style={{ color }} />;
};