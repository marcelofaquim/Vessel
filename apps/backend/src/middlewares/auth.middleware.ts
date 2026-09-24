import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayLoad {
    userId: string;
    role: string;
    iat: number;
    expo: number;
}

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json( { error: 'Token de autenticação não foi fornecido.' })
    }

    const [,token] = authHeader.split(' ');

    try {
        const secret = process.env.JWT_SECRET || 'vessel_jwt_secret_super_seguro_2026';
        const decoded = jwt.verify(token, secret) as TokenPayLoad;
    
        // Injeta o ID e role do utilizador na requisição
        (req as any).user = {
            id: decoded.userId,
            role: decoded.role,
        };

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'TOken inválido ou expirado' })
    }
};