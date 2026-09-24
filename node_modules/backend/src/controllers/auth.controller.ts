import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma'; 

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Verificar se o utilizador existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 2. Validar a palavra-passe
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 3. Gerar o token JWT
    const secret = process.env.JWT_SECRET || 'vessel_jwt_secret_super_seguro_2026';
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      secret,
      { expiresIn: '1d' }
    );

    // 4. Retornar resposta sem expor o hash da senha
    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao autenticar utilizador.' });
  }
};