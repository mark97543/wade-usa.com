// /server/routes/authRoutes.js

import express from 'express';
import db from '../config/db.js'//import databse
import bcrypt from 'bcrypt'//Import bcrypt for password hashing and comparison
import jwt from 'jsonwebtoken' //Import for web token

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET; //Access token from .env

//Check to see if secret is loaded 
if (!jwtSecret){
    console.error('Fatal ERROR: JWT_SECRET is not defined: aithRoutes.js')
}


/* -------------------------- Post /api/auth/login -------------------------- */
//#region
router.post('/login', async(req,res)=>{
    //Extract Data from request body
    const {email, password}=req.body;

    //basic validations
    if(!email || !password){
        return res.status(400).json({message:'Emails and password are required'}) //TODO: Low Side will need to pass this message to user. 
    }

    try{
        //1,Find the user in the db by email
        const result = await db.query('SELECT id, email, password_hash, is_approved FROM users WHERE email = $1', [email]);
        const user = result.rows[0]//The first Row is the user if found

        //Check if the User is found
        if(!user){
            //if no user found send a 401 Unautherized user
            return res.status(401).json({message: 'Invalid credentials'})
        }

        //2. Compare the provided password with the stored password hash
        const passwordMatch = await bcrypt.compare(password, user.password_hash)

        //Check if the passwords match
        if(!passwordMatch){
            //If passwords dont match, send a 401 unautherized user
            return res.status(401).json({message: 'Invalid Credentials'})
        }

        //Check for Admin Approval
        if (!user.is_approved) {
            // If passwords match but user is not approved
            return res.status(401).json({ message: 'Your account is pending administrator approval.' });
        }

        /* --------------------------- generate new token --------------------------- */

        // Define the payload for the token. Only include non-sensitive info.
        const payload = {
            user: {
                id: user.id,
                email: user.email
                // Add other non-sensitive info needed for authentication/authorization checks later
                // e.g., role: user.role
            }
        };
        

        const token = jwt.sign(
            payload,
            jwtSecret, //use secret key from enviremental variable. 
            {expiresIn:'1h'} //Options: Sets expiretion time
        )

        //3. if credentials are valid Return response

        res.status(200).json({
            message: 'Login Successful',
            token: token, //Includes generated token in the response
            user:{
                id:user.id,
                email: user.email
                //Add other non sensative data here
            }
        })

    }catch(error){
        //if any erro occurs during db query
        console.error("/login authRoutes.js: Database query error during login: ", error);
        res.status(500).json({message: 'An Error occured during login: /login, authRoutes.js'})
    }

});
//#endregion





/* ---------- Post /api/auth/register route for uscer registration ---------- */
//#region
router.post('/register', async (req,res)=>{
    //extract new users email and password from the request body
    const{email, password}=req.body

    //basic validation
    if(!email || !password){
        return res.status(400).json({message: 'Email and Password are required.'})
    }

    try{
        //1. Check if user with this email already exists
        const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);

        if(existingUser.rows.length > 0){
            //If a user email is already there, send the conflict error
            return res.status(409).json({message: 'Email already exists'})
        }

        //2, Hash the password before storing it
        const saltRounds =10; //determines the complexity 10 is common value
        const passwordHash = await bcrypt.hash(password, saltRounds)

        //3. Insert the new user into the database
        const newUser = await db.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
            [email, passwordHash] // Use the hashed password here
        )

        //The Returning clause gives us the newly created user's data

        //4. Send the success resonse (201) created
        res.status(201).json({
            message: 'User registered Successfully. Your Account is pending administrator approval.',
            user:{
                id:createdUser.id,
                email: createdUser.email,
                created_at: createdUser.created_at
            }
        })
    }catch(error){
        //Handle any errors during hashing or database operations
        console.error('/registraion, authRoutes.js; Registration error: ', error)
        res.status(500).json({message:'/registraion, authRoutes.js; Registration error'})
    }
})

//#endregion





export default router; 