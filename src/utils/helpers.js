import { BASE_URL } from "@/config/constants";

/**
 * Resolves the correct image URL for both Cloudinary (absolute) and local (relative) paths.
 */
export const getImageUrl = (path) => {
  if (!path) return null;
  
  // If it's already a full URL (Cloudinary or otherwise), return it
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }
  
  // Ensure the relative path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Return with the base URL prepended
  return `${BASE_URL}${cleanPath}`;
};
