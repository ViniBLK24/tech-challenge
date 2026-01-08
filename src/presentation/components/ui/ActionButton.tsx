import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "./Button";
import { Pencil, Trash2, File } from "lucide-react";

interface ActionButtonProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onViewFile?: () => void;
}

export default function ActionButton({
  onEdit,
  onDelete,
  onViewFile,
}: ActionButtonProps) {
  const renderButton = (icon: React.ReactNode, onClick?: () => void) => (
    <Button
      onClick={onClick}
      className={cn(
        buttonVariants({ size: "sm" }),
        "bg-black text-white cursor-pointer hover:text-white hover:bg-neutral-500"
      )}
    >
      {icon}
    </Button>
  );

  return (
    <div className="flex gap-1">
      {onViewFile && renderButton(<File />, onViewFile)}
      {onEdit && renderButton(<Pencil />, onEdit)}
      {onDelete && renderButton(<Trash2 />, onDelete)}
    </div>
  );
}
