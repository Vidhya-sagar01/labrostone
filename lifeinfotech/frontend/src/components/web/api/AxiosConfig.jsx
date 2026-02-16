import axios from "axios";

const baseURL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5001"
    : "https://lebrostonebackend.lifeinfotechinstitute.com";

/** Base URL for images/uploads - always use backend URL */
export const IMAGE_BASE_URL = "https://lebrostonebackend.lifeinfotechinstitute.com";

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
