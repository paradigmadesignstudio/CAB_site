import { Loader2 } from "lucide-react";
import { Button } from "@/pages/ui/button";

interface LoadMoreButtonProps {
  label: string;
  hasMore: boolean;
  loading: boolean;
  onClick: () => void;
  className?: string;
}

export function LoadMoreButton({
  label,
  hasMore,
  loading,
  onClick,
  className,
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Carregando...
        </>
      ) : (
        label
      )}
    </Button>
  );
}
