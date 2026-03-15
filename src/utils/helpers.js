export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date';
  return new Date(dateString).toLocaleString();
};