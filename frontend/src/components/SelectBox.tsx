import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";

export type SelectItemValue<T = string> = {
  value: T;
  label: string;
};

type Props<T> = SelectProps & {
  items: SelectItemValue<T>[];
  placeholder?: string;
  clearable?: boolean;
};

const SelectBox = <T extends string | number>({ value, onValueChange, items, placeholder, clearable }: Props<T>) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {clearable && (
          <SelectItem key="clear" value="none">
            (None)
          </SelectItem>
        )}
        {items.map((item) => (
          <SelectItem key={String(item.value)} value={String(item.value)}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
export default SelectBox;
