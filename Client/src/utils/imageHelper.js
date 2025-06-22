const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Formats profile image URLs to ensure they are properly displayed
 * @param {string} imageUrl - The original image URL from the backend
 * @returns {string|null} - Formatted URL or null if no image
 */
export const getProfileImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  if (imageUrl === './defaultImage.png' || imageUrl === 'defaultImage.png') {
    return `${API_URL}/defaultImage.png`;
  }
  
  return `${API_URL}/${imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl}`;
};

/**
 * Creates a data URL from a file for preview
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Data URL
 */
export const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};