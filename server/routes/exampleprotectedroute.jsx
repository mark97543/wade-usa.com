// server/routes/userRoutes.js (Example)

import express from 'express';
import db from '../config/db.js';
import protect from '../middleware/authMiddleware.js'; // Import the protect middleware

const router = express.Router();

// Apply the 'protect' middleware to all routes defined AFTER this line in THIS router
// router.use(protect);

// Or apply 'protect' only to specific routes:

// GET /api/users/me - Get the current user's profile (Requires authentication)
router.get('/me', protect, async (req, res) => {
    // If we reach here, the 'protect' middleware successfully verified the token
    // The authenticated user's info is available in req.user
    try {
        // Optional: Fetch the latest user data from DB if needed, but req.user has basic info
        const result = await db.query('SELECT id, email, created_at FROM users WHERE id = $1', [req.user.id]);
        const user = result.rows[0];

        if (!user) {
             // This shouldn't happen if token verification worked, but as a safeguard
             return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User data fetched successfully',
            user: {
                id: user.id,
                email: user.email,
                created_at: user.created_at
            }
        });

    } catch (error) {
         console.error('Error fetching user data:', error);
         res.status(500).json({ message: 'An error occurred fetching user data' });
    }
});

// PUT /api/users/me - Update current user's profile (Requires authentication)
// router.put('/me', protect, async (req, res) => { /* ... update logic using req.user.id ... */ });


export default router; // Make sure this router is mounted in server.js (e.g., app.use('/api/users', userRoutes))