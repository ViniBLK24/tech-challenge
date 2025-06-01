import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./Button";
import { Pencil, Trash2 } from "lucide-react";

interface ActionButtonProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ActionButton({ onEdit, onDelete }: ActionButtonProps) {
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
      {renderButton(<Pencil />, onEdit)}
      {renderButton(<Trash2 />, onDelete)}
    </div>
  );
}
