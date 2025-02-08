import React, { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import FilterSection from "../FilterSection.js";
import styles from "./AgeFilter.module.css";

const AgeFilter = ({ ageRange=100 }) => {
  const [tempRange, setTempRange] = useState([ageRange.min, ageRange.max]);

  useEffect(() => {
    setTempRange([ageRange.min, ageRange.max]);
  }, [ageRange]);

  const handleSliderChange = (event, newValue) => {
    setTempRange(newValue);
  };

  return (
    <FilterSection title="Age Range">
      <div className={styles.ageRangeContainer}>
        <div className={styles.sliderContainer}>
          <Slider
            value={tempRange}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            min={0}
            max={100}
            marks
            sx={{
              color: "white", // Change the bar color
              height: 4, // Adjust the height of the slider bar
              '& .MuiSlider-thumb': {
                height: 17.5,
                width: 17.5,
                backgroundColor: 'black',
                border: '2px solid white',
              },
              '& .MuiSlider-rail': {
                opacity: 0,
                backgroundColor: "black",
              },
            }}
         />
        </div>
        <div className={styles.display}>
          <p>Age Range: {tempRange[0]} - {tempRange[1]}</p>
        </div>
      </div>
    </FilterSection>
  );
};

export default AgeFilter;
