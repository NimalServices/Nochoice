const rawApiUrl = import.meta.env.VITE_API_URL || "";
const apiBaseUrl = rawApiUrl.replace(/\/+$|^\s+|\s+$/g, "");

export const buildApiUrl = (path) => {
  const normalizedPath = path.trim().replace(/^\/+/g, "");
  return `${apiBaseUrl}/${normalizedPath}`;
};
