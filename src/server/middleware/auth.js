import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
        console.log("Token Successfull")
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default auth; // Ensure you're using the default export
