import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY || 'backend-edu';

const tokenOptions = {
    expiresIn: '1h', // Token will expire in 1 hour
};

export const generateToken = (payload) => {
    if (!payload) throw new Error("Payload is required to generate a token");
    return jwt.sign(payload, secretKey, tokenOptions);
};
