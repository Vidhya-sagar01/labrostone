import axios from "axios";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const baseURL = isLocalhost
  ? "http://localhost:5001" 
  : "https://lebrostonebackend4.lifeinfotechinstitute.com";

/** Base URL for images/uploads - use same logic as baseURL */
export const IMAGE_BASE_URL = isLocalhost
  ? "http://localhost:5001"
  : "https://lebrostonebackend4.lifeinfotechinstitute.com";

/**
 * Build full image URL from path (e.g. /uploads/... or uploads/...).
 * @param {string} path - Image path from API (e.g. "/uploads/xyz.jpg" or "uploads/xyz.jpg")
 * @returns {string} Full URL
 */
export const getImageUrl = (path) => {
  if (!path) return "";
  if (typeof path !== "string") return "";
  if (path.startsWith("http")) return path;
  const cleanPath = path.replace(/^\/+/, "").replace("public/", "");
  return `${IMAGE_BASE_URL}/${cleanPath}`;
};

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

export default instance;
