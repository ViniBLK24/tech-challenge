import { Button } from "@/components/ui/Button";
import { CardTitle } from "@/components/ui/Card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  backHref: string;
  backLabel: string;
}

export default function PageHeader({
  title,
  backHref,
  backLabel,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col mb-6 justify-start">
      <div>
        <Button variant="ghost" className="p-2" asChild>
          <Link href={backHref}>
            <ChevronLeft size={16} />
            {backLabel}
          </Link>
        </Button>
      </div>
      <h2 className="gap-2">
        <CardTitle className="text-2xl text-[25px]">{title}</CardTitle>
      </h2>
    </div>
  );
}
