import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToolbarProps {
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
  categories: string[];
}

const Toolbar = ({ onSearch, onCategoryChange, categories }: ToolbarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="toolbar flex items-center gap-4 mb-6">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search courses..."
        className="toolbar__search px-3 py-2 w-full max-w-xs rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
      />

      <Select onValueChange={onCategoryChange}>
        <SelectTrigger className="toolbar__select w-[220px] rounded-md border border-gray-300">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>

        <SelectContent className="bg-customgreys-primarybg text-white">
          {/* ✅ Single 'All' option */}
          <SelectItem value="all" className="toolbar__select-item">
            All Categories
          </SelectItem>

          {categories.map((category) => (
            <SelectItem
              key={category}
              value={category}
              className="toolbar__select-item capitalize"
            >
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Toolbar;
