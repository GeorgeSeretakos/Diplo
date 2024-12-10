// utils/wikidata/formatters.js

export const formatPositionHeld = (positions) => {
  const uniquePositions = [
    ...new Map(
      positions.map((item) => [
        `${item.position}-${item.startTime}-${item.endTime}`, // Unique key
        item,
      ])
    ).values(),
  ];

  return uniquePositions.map((pos) => {
    const details = [];
    if (pos.startTime) details.push(`Start: ${new Date(pos.startTime).toLocaleDateString("el-GR")}`);
    if (pos.endTime) details.push(`End: ${new Date(pos.endTime).toLocaleDateString("el-GR")}`);
    return `${pos.position} (${details.join(", ")})`;
  });
};
