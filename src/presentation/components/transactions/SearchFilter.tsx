import { Input } from "../ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { TransactionTypeEnum } from "@/domain/entities";
import { Search } from "lucide-react";

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
}

export default function SearchFilter({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
}: SearchFilterProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={18} />
        <Input
          type="text"
          placeholder="Buscar por valor"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Select defaultValue="all" value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por tipo">
            {typeFilter === "all" && "Todos os tipos"}
            {typeFilter === TransactionTypeEnum.DEPOSIT && "Depósito"}
            {typeFilter === TransactionTypeEnum.TRANSFER && "Transferência"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value={TransactionTypeEnum.DEPOSIT}>Depósito</SelectItem>
          <SelectItem value={TransactionTypeEnum.TRANSFER}>Transferência</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
