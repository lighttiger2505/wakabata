import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";

export type SelectItemValue = {
  value: number;
  label: string;
};

type Props = SelectProps & {
  items: SelectItemValue[];
  placeholder?: string;
};

const SelectBox: React.FC<Props> = ({ value, onValueChange, items, placeholder }) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={String(item.value)}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
export default SelectBox;
