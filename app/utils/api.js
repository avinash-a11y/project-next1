'use client';

/**
 * Get the base URL for API requests
 * 
 * This function returns the appropriate base URL depending on the environment.
 * In production, it uses the NEXT_PUBLIC_API_URL environment variable.
 * In development or if the environment variable is not set, it falls back to a relative URL.
 */
export const getApiBaseUrl = () => {
  // When running in the browser, we can check if we're in a production environment
  const isProduction = process.env.NODE_ENV === 'production';
  // Check if we're running on the client side
  const isBrowser = typeof window !== 'undefined';
  
  // If NEXT_PUBLIC_API_URL is set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // In a production browser environment without NEXT_PUBLIC_API_URL, use the current origin
  if (isProduction && isBrowser) {
    return window.location.origin;
  }
  
  // In development or if nothing else works, use relative URLs which work in any environment
  return '';
};

/**
 * Make an API request with the correct base URL
 * @param {string} endpoint - The API endpoint (e.g., /api/users)
 * @param {Object} options - Fetch options
 * @returns {Promise} - Fetch promise
 */
export const apiRequest = async (endpoint, options = {}) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  return fetch(url, options);
};

/**
 * Make a GET request to the API
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise} - Fetch promise
 */
export const apiGet = async (endpoint, options = {}) => {
  return apiRequest(endpoint, { 
    method: 'GET',
    ...options
  });
};

/**
 * Make a POST request to the API
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The data to send
 * @param {Object} options - Additional fetch options
 * @returns {Promise} - Fetch promise
 */
export const apiPost = async (endpoint, data, options = {}) => {
  return apiRequest(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: JSON.stringify(data),
    ...options
  });
}; 