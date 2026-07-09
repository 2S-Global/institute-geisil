import nullSvg from "@/images/null.svg";
import { Button } from "@/components/ui/button";

interface NoDataProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function NoData({
  title = "No data available",
  description,
  actionLabel,
  onAction,
  className = "",
}: NoDataProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center animate-fade-in ${className}`}>
      <div className="relative mb-6 max-w-[280px] md:max-w-[320px]">
        <img
          src={nullSvg}
          alt="No data"
          className="w-full h-auto object-contain opacity-90 select-none pointer-events-none drop-shadow-md hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>
      <h3 className="font-display text-xl font-bold text-foreground/90 tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mt-2 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          size="sm"
          className="mt-6 font-medium shadow-sm hover:shadow-md transition-all gap-1.5"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
