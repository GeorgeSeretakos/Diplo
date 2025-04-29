import React, { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import FilterSection from "./FilterSection.js";

const AgeFilter = ({ selectedAgeRange, onFilterChange }) => {
  const [tempRange, setTempRange] = useState([selectedAgeRange.min, selectedAgeRange.max]);

  useEffect(() => {
    setTempRange([selectedAgeRange.min, selectedAgeRange.max]);
  }, [selectedAgeRange]);

  const handleSliderChange = (event, newValue) => {
    setTempRange(newValue);
    onFilterChange({ min: newValue[0], max: newValue[1] }); // ✅ Communicate with parent
  };

  return (
    <FilterSection title="Age Range">
      <div className="flex flex-col pl-4">
        <div className="w-[100%]">
          <Slider
            value={tempRange}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            min={18}
            max={100}
            marks
            sx={{
              color: "white",
              height: 4,
              '& .MuiSlider-thumb': {
                height: 17.5,
                width: 17.5,
                backgroundColor: "#1a1a1a",
                border: '2px solid white',
              },
              '& .MuiSlider-track': {
                backgroundColor: "white",
              },
              '& .MuiSlider-rail': {
                opacity: 0.3,
                backgroundColor: "#1a1a1a",
              },
            }}
          />
        </div>
        <div className="w-[100%] text-center text-white text-base">
          <p>Speaker Age: {tempRange[0]} - {tempRange[1]}</p>
        </div>
      </div>
    </FilterSection>
  );
};

export default AgeFilter;
