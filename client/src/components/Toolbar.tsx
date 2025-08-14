import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courseCategories } from "@/lib/utils";

/* =========================================================
   Toolbar
   - Provides search and category filtering for courses.
   - Includes:
       • Text input → filters by course name.
       • Category dropdown → filters by category.
   - Communicates changes to parent via:
       • onSearch(value: string)
       • onCategoryChange(value: string)
   ========================================================= */
const Toolbar = ({ onSearch, onCategoryChange }: ToolbarProps) => {
  /* ---------- Local State ---------- */
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------- Handlers ---------- */
  // Update search term locally & notify parent
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  /* ---------- Render ---------- */
  return (
    <div className="toolbar">
      {/* ---------- Search Input ---------- */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search courses"
        className="toolbar__search"
      />

      {/* ---------- Category Dropdown ---------- */}
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
