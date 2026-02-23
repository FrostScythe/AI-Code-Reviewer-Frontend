export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};