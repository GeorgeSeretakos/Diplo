import React, {useState} from "react";

const renderOptionContent = (option, inputValues, handleInputChange) => {

  switch(option) {
    case "Search by Name":
      return (
        <div className="inputContainer query">
          <input
            type="text"
            value={inputValues.speakerName || ""}
            onChange={(e) => handleInputChange('speakerName', e.target.value)}
            placeholder="Enter the speaker's name"
            required
          />
        </div>
      );
    // case "Search by Political Party":
    //   return (
    //     <div className="query">
    //       <input
    //         type="text"
    //         value={inputValues.actor || ""}
    //         onChange={(e) => handleInputChange('actor', e.target.value)}
    //         placeholder="Enter actor/cast member"
    //         required
    //       />
    //     </div>
    //   );
    case "Search by Key Phrase":
      return (
        <div className= "query">
          <input
            type="text"
            value={inputValues.keyPhrase || ""}
            onChange={(e) => handleInputChange('keyPhrase', e.target.value)}
            placeholder="Enter the key-prhase"
            required
          />
        </div>
      );
    // case "Search by Topic":
    //   return (
    //     <div className= "query">
    //       <input
    //         type="text"
    //         value={inputValues.actor || ""}
    //         onChange={(e) => handleInputChange('actor', e.target.value)}
    //         placeholder="Enter actor/cast member"
    //         required
    //       />
    //     </div>
    //   );
    // Add cases for other options
    default:
      return null;
  }
};

export default renderOptionContent;