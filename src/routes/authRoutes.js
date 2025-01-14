import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

const router = express.Router();

// Register a new user endpoing /auth/register
router.post('/register', async (req, res) => {
    
    console.log('Request body:', req.body);
    const { lastName, firstName, email, password } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).send({ message: 'All fields are required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    console.log('Request body:', req.body);
    
    try {
        const user = await prisma.user.create({
            data: {
                lastName,
                firstName,
                email,
                password: hashedPassword,
            }
        });

        // Create a token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(503).send({ message: 'Service Unavailable', error: err.message });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        // if we cannot find a user associated with that username, return out from the function
        if (!user) {
            return res.status(404).send({ message: 'User not found!' });
        };

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ massage: 'Invalid password!' });
        }
        console.log(user);

        // We now have a successful authentication!
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        console.log(err.message);
        res.sendStatus(503);
    }
});

export default router;