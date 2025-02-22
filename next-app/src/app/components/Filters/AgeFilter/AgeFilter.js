import React, { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import FilterSection from "../FilterSection.js";
import styles from "./AgeFilter.module.css";

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
      <div className={styles.ageRangeContainer}>
        <div className={styles.sliderContainer}>
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
        <div className={styles.display}>
          <p>Speaker Age: {tempRange[0]} - {tempRange[1]}</p>
        </div>
      </div>
    </FilterSection>
  );
};

export default AgeFilter;
