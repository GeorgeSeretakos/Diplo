export function formatDate (isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export function formatDateToGreek(dateString) {
  try {
    const date = new Date(dateString);

    // Specify Greek locale and desired options
    const formatter = new Intl.DateTimeFormat("el-GR", {
      weekday: "long", // Full weekday name
      day: "numeric",  // Day of the month
      month: "long",   // Full month name
      year: "numeric", // Full year
    });

    return formatter.format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return null;
  }
}