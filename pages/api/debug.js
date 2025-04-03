export default function handler(req, res) {
  // Get environment information (safely excluding sensitive data)
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL === '1' ? true : false,
    VERCEL_ENV: process.env.VERCEL_ENV,
    HAS_OPENAI_KEY: !!process.env.OPENAI_API_KEY,
  };

  // Return debug information
  res.status(200).json({
    timestamp: new Date().toISOString(),
    env,
    runtime: {
      node: process.version,
    },
  });
} 