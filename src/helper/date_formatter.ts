export const formatDate = (entry: any) => {
  const date = new Date(entry);
  // Optional: Include time as well
  const formattedDateTime = date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return formattedDateTime;
};
