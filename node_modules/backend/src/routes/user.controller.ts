import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function createUserHandler(req: Request, res: Response) {
  try {
    const { email, name, password, role } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'E-mail e nome são obrigatórios.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: password || 'hash_temporario_123',
        role: role ? (role as any) : undefined,
      },
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ error: 'Erro interno ao criar usuário.' });
  }
}

export async function getUsersHandler(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany();
    return res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar usuários.' });
  }
}
  
