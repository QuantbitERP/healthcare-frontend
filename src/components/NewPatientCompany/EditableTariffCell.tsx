import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface EditableTariffCellProps {
  initialValue: string | number | undefined;
  rowIndex: number;
  onUpdate: (value: string) => void;
  type?: 'number' | 'text';
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
}

const EditableTariffCell: React.FC<EditableTariffCellProps> = ({
  initialValue,
  rowIndex,
  onUpdate,
  type = 'number',
  min = 0,
  max = 100,
  step = 1,
  placeholder = '0',
  className = 'w-25 h-8 text-sm'
}) => {
  const [value, setValue] = useState<string>(initialValue?.toString() || '');
  const [, setIsEditing] = useState(false);

  useEffect(() => {
    setValue(initialValue?.toString() || '');
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(value);
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setValue(initialValue?.toString() || '');
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full">
      <Input
        key={`editable-${rowIndex}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        className={className}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
};

export default EditableTariffCell;
