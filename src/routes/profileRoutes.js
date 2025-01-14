import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/show-all-users', async(req, res) => {
    const users = await prisma.user.findMany({})
    res.json(users);
})

// Update password
router.put('/update-password', async (req, res) => {
    const userId = req.userId; // From middleware
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).send({ message: 'User not found' });

        const isValid = bcrypt.compareSync(oldPassword, user.password);
        if (!isValid) return res.status(401).send({ message: 'Incorrect old password' });

        const hashedPassword = bcrypt.hashSync(newPassword, 8);
        await prisma.user.update({ 
            where: { 
                id: userId 
            }, 
            data: { 
                password: hashedPassword 
            } 
        });
        res.send({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
});

// Update email
router.put('/update-email', async (req, res) => {
    const userId = req.userId; // From middleware
    const newEmail = req.body.newEmail;

    const existingUser = await prisma.user.findUnique({
        where: { email: newEmail }
    });
    if (existingUser) {
        return res.status(400).send({ message: 'Email already in use' });
    };

    try {
        await prisma.user.update({ 
            where: { 
                id: userId 
            }, 
            data: { 
                email: newEmail 
            }
        });
        console.log(`Email updated for userId ${userId}: ${newEmail}`);
        res.send({ message: `Email updated for userId ${userId}: ${newEmail}` });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
});

// Delete account
router.delete('/delete-account', async (req, res) => {
    const userId = req.userId;

    try {
        await prisma.user.delete({ 
            where: { 
                id: userId 
            }
        });
        res.send({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
});

export default router;