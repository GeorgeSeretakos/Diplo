import React from 'react';
import {Label} from "@components/ui/label.js";

const FilterSection = ({title, children}) => {
  return (
    <div className="flex flex-col space-y-4 mb-8">
      <Label htmlFor="startDate">{title}</Label>
      {children}
    </div>
  );
};

export default FilterSection;
