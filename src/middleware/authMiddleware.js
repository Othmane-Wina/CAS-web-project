import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) { return res.status(401).json({ message: "No token provided" }) };

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { return res.status(401).json({ message: "Invalid token" }) };

        req.userId = decoded.id; // when we register or login, we actually create the token encoding the id (by jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h'}))
        // so when we encode it into the token we can then decode it, thats basically what decoded does. Consequently we can get out the id and verify the user.
        next();
    })
}


function adminOnlyMiddleware(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        req.userId = user.id;
        req.userRole = user.role;
        next();
    });
}

export { adminOnlyMiddleware };

export default authMiddleware;