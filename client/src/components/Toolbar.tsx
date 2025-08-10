import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courseCategories } from "@/lib/utils";

/* =========================
   Toolbar Component
   Provides:
   - A search input for filtering courses by name
   - A category dropdown for filtering courses by category
   Calls `onSearch` and `onCategoryChange` props to pass values up to the parent.
   ========================= */
const Toolbar = ({ onSearch, onCategoryChange }: ToolbarProps) => {
  /* ---------- Local State ---------- */
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------- Handlers ---------- */
  // Updates local search term & notifies parent component
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  /* ---------- Render ---------- */
  return (
    <div className="toolbar">
      {/* Search input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search courses"
        className="toolbar__search"
      />

      {/* Category select dropdown */}
      <Select onValueChange={onCategoryChange}>
        <SelectTrigger className="toolbar__select">
          <SelectValue placeholder="Categories" />
        </SelectTrigger>

        <SelectContent className="bg-customgreys-primarybg hover:bg-customgreys-primarybg">
          {/* "All" option */}
          <SelectItem value="all" className="toolbar__select-item">
            All Categories
          </SelectItem>

          {/* Dynamic category list */}
          {courseCategories.map((category) => (
            <SelectItem
              key={category.value}
              value={category.value}
              className="toolbar__select-item"
            >
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Toolbar;
