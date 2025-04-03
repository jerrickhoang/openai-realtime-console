// This is a wrapper around our main server.js file for Vercel serverless environment
import '../server.js';

// Export a handler compatible with Vercel serverless functions
export default function handler(req, res) {
  // The main server.js file handles all routing
  // This file just ensures Vercel can find our server.js entrypoint
}; 