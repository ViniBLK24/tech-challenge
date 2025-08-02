import { Button } from "@/components/ui/Button";
import { CardTitle } from "@/components/ui/Card";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  backHref: string;
  backLabel: string;
}

export default function PageHeader({ title, backHref, backLabel }: PageHeaderProps) {
  return (
    <div className="flex items-center mb-4">
      <Button variant="link" className="p-0 mr-4" asChild>
        <a href={backHref} className="flex items-center">
          <ChevronLeft size={16} />
          {backLabel}
        </a>
      </Button>
      <CardTitle className="text-2xl text-[25px]">{title}</CardTitle>
    </div>
  );
}