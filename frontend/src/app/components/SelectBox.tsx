import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type SelectItemValue = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  setValue: (v: string) => void;
  items: SelectItemValue[];
  placeholder?: string;
};

const SelectBox: React.FC<Props> = ({ value, setValue, items, placeholder }) => {
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
export default SelectBox;
