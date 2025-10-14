import React from 'react';
import { X } from 'lucide-react';

interface SelectedItem {
  id: string;
  label: string;
}

interface SelectedItemsListProps {
  items: SelectedItem[];
  onRemove: (id: string) => void;
}

const SelectedItemsList: React.FC<SelectedItemsListProps> = ({ items, onRemove }) => {
  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-1 px-2 py-0.5 bg-[#E6F4FE] text-[#0D74CE] rounded text-xs"
        >
          <span>{item.label}</span>
          <button
            onClick={() => onRemove(item.id)}
            className="hover:text-[#0D74CE]/80"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SelectedItemsList; 