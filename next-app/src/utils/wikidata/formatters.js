export const formatPositionHeld = (positions) => {
  const uniquePositions = [
    ...new Map(
      positions
        .filter((item) => item.position) // Filter out invalid items
        .map((item) => [
          `${item.position}-${item.of || ""}-${item.startTime || ""}-${item.endTime || ""}`, // Unique key
          item,
        ])
    ).values(),
  ];

  return uniquePositions.map((pos) => {
    let dateDetails = "";

    // Format the date string based on the presence of start and end dates
    if (pos.startTime && pos.endTime) {
      dateDetails = `(Από ${new Date(pos.startTime).toLocaleDateString("el-GR")} έως ${new Date(pos.endTime).toLocaleDateString("el-GR")})`;
    } else if (pos.startTime) {
      dateDetails = `(Από ${new Date(pos.startTime).toLocaleDateString("el-GR")})`;
    }

    // Format the position string, including the "of" value if present
    const ofDetails = pos.of ? ` του/της ${pos.of}` : "";
    return `${pos.position}${ofDetails} ${dateDetails}`;
  });
};
