'use client';

/**
 * Get the base URL for API requests
 * 
 * This function returns the appropriate base URL depending on the environment.
 * In production, it uses the NEXT_PUBLIC_API_URL environment variable.
 * In development or if the environment variable is not set, it falls back to http://localhost:3000.
 */
export const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
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