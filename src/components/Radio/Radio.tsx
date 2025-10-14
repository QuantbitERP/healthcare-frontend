import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define the shape of the items prop
interface RadioItem {
  value: string;
  label: string;
}

interface RadioProps {
  items: RadioItem[];
}

const Radio: React.FC<RadioProps> = ({ items }) => {
  return (
    <RadioGroup defaultValue="comfortable">
      {items.map((item) => (
        <div key={item.value} className="flex items-center space-x-2">
          <RadioGroupItem value={item.value} id={item.value} />
          <Label htmlFor={item.value} className="cursor-pointer">
            {item.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default Radio;
