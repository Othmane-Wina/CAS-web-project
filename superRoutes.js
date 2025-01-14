import express from 'express';
import prisma from '../prismaClient.js';
import { adminOnlyMiddleware } from '../middleware/authMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/members', async (req, res) => {
    try {
        const members = await prisma.member.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                        firstName: true, // Include firstName
                        lastName: true,  // Include lastName
                    }
                }
            }
        });

        // Format the response
        const formattedMembers = members.map(member => ({
            lastName: member.user.lastName,
            firstName: member.user.firstName,
            grade: member.grade,
            stream: member.stream,
            email: member.user.email
        }));

        res.json(formattedMembers);
    } catch (err) {
        console.error("Error fetching members:", err);
        res.status(500).send({ message: "Server error" });
    }
});


router.post('/members', adminOnlyMiddleware, async (req, res) => {
    const { lastName, firstName, grade, stream } = req.body;

    if (!lastName || !firstName || !grade || !stream) {
        return res.status(400).send({ message: "All fields are required." });
    }

    try {
        const user = await prisma.user.findFirst({ where: { firstName, lastName } });

        if (!user) return res.status(404).send({ message: "User not found. Please register first." });

        if (user.role === 'ADMIN') {
            return res.status(403).send({ message: "Cannot modify admin roles." });
        }

        const existingMember = await prisma.member.findFirst({ where: { userId: user.id } });

        if (existingMember) {
            const updatedMember = await prisma.member.update({
                where: { id: existingMember.id },
                data: { grade, stream },
            });
            return res.json({ message: "Member updated successfully.", updatedMember });
        }

        const newMember = await prisma.member.create({
            data: { userId: user.id, grade, stream },
        });

        res.json({ message: "Member added successfully.", newMember });
    } catch (err) {
        console.error("Error handling member:", err);
        res.status(500).send({ message: "Server error." });
    }
});

// Move to admin table
router.put('/members/move-to-admin', adminOnlyMiddleware, async (req, res) => {
    const { firstName, lastName, grade, stream } = req.body;

    if (!firstName || !lastName || !grade || !stream) {
        return res.status(400).send({ message: "All fields are required." });
    }

    try {
        const user = await prisma.user.findFirst({ where: { firstName, lastName } });

        if (!user) return res.status(404).send({ message: "User not found." });

        if (user.role === 'ADMIN') {
            return res.status(403).send({ message: "Cannot modify admin roles." });
        }

        await prisma.member.delete({ where: { userId: user.id } });

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { role: 'ADMIN' },
        });

        res.json({ message: "User moved to admin successfully.", updatedUser });
    } catch (err) {
        console.error("Error moving to admin:", err);
        res.status(500).send({ message: "Server error." });
    }
});



router.delete('/members/:email', async (req, res) => {
    const { email } = req.params;
    console.log("Received email for deletion:");

    if (!email) {
        return res.status(400).json({ message: "Invalid or missing email" });
    }

    try {
        // Delete the member and associated user
        const deletedMember = await prisma.$transaction(async (tx) => {
            // Find the user by email
            const user = await tx.user.findUnique({
                where: { email }
            });

            if (!user) {
                throw new Error("User not found");
            }

            // Find the member associated with the user
            const member = await tx.member.findUnique({
                where: { userId: user.id },
            });

            if (!member) {
                throw new Error("Member not found");
            }

            // Delete the user, which cascades to the member
            await tx.user.delete({
                where: { id: user.id },
            });

            return member;
        });

        res.json({ message: 'Member and user deleted successfully', deletedMember });
    } catch (err) {
        console.error('Error deleting member:', err.message);
        res.status(500).send({ message: 'Failed to delete member and user' });
    }
});

router.get('/admins', async (req, res) => {
    try {
        const admins = await prisma.member.findMany({
            where: { 
                role: 'ADMIN' 
            },
            include: {
                user: {
                    select: { 
                        email: true, 
                        firstName: true, 
                        lastName: true 
                    },
                },
            },
        });

        const formattedAdmins = admins.map(admin => ({
            email: admin.user.email,
            firstName: admin.user.firstName,
            lastName: admin.user.lastName,
            grade: admin.grade,
            stream: admin.stream,
            role: admin.role
        }));

        res.json(formattedAdmins);
    } catch (err) {
        console.error("Error fetching admins:", err);
        res.status(500).send({ message: "Server error" });
    }
});

router.post('/members', async (req, res) => {
    const { lastName, firstName, grade, stream, previousLastName, previousFirstName } = req.body;

    if (!lastName || !firstName || !grade || !stream) {
        return res.status(400).send({ message: "All fields are required." });
    }

    try {
        // If previousLastName and previousFirstName are provided, check if the member exists
        if (previousLastName && previousFirstName) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    firstName: previousFirstName,
                    lastName: previousLastName,
                }
            });

            if (existingUser) {
                // Update existing member
                const updatedMember = await prisma.member.update({
                    where: { userId: existingUser.id },
                    data: {
                        grade,
                        stream,
                        user: {
                            update: {
                                firstName,
                                lastName
                            }
                        }
                    }
                });

                return res.json({ message: "Member updated successfully.", updatedMember });
            }
        }

        // Add a new member if no matching previous characteristics
        const user = await prisma.user.findFirst({
            where: { 
                firstName, 
                lastName 
            }
        });

        if (!user) {
            return res.status(404).send({ message: "User not found. Please register first." });
        }

        const newMember = await prisma.member.create({
            data: {
                userId: user.id,
                grade,
                stream
            }
        });

        res.json({ message: "Member added successfully.", newMember });
    } catch (err) {
        console.error("Error handling member:", err);
        res.status(500).send({ message: "Server error." });
    }
});


export default router;
