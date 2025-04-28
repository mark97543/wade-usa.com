// /server/middleware/authMiddleware.js

import jwt from 'jsonwebtoken'; // Import jsonwebtoken for verification

// Load your JWT Secret from environment variables
const jwtSecret = process.env.JWT_SECRET;

// Basic check to ensure the secret is loaded
if (!jwtSecret) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in authMiddleware.js');
    // In a real app, you might want to exit the process or handle this more gracefully
    // process.exit(1);
}

// Middleware function to verify JWT token
const protect = (req, res, next) => {
    // Get the token from the Authorization header
    // Format is typically "Bearer YOUR_TOKEN_HERE"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get the token string after "Bearer "

    // If no token is provided, send 401 Unauthorized
    if (token == null) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    // Verify the token
    jwt.verify(token, jwtSecret, (err, decodedPayload) => {
        // If verification fails (invalid signature, expired token, etc.), send 403 Forbidden (or 401)
        if (err) {
            console.error('Token verification failed:', err.message);
            return res.status(403).json({ message: 'Invalid or expired token' }); // 403 Forbidden
        }

        // If verification succeeds, attach the decoded payload (containing user info)
        // to the request object so subsequent route handlers can access it.
        req.user = decodedPayload.user; // Assuming your payload has a 'user' object with id/email

        // Call next() to pass the request to the next middleware or the route handler
        next();
    });
};

export default protect; // Export the middleware function