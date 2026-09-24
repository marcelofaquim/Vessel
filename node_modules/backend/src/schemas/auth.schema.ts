import { z } from 'zod';

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email({ message: 'E-mail inválido. '}),
        password: z.string().min(6, { message: 'A palavra-passe deve ter pelo menos 6 caracteres.' })
    }),
});