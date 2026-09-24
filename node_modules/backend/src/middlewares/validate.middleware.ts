import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                error: 'Erro de validação dos dados enviados.',
                details: error.issues.map((issue) => ({
                    field: issue.path.map(String).join('.'),
                    message: issue.message
                })),
               }); 
            }
            return res.status(500).json({ error: 'Erro de validação interna.' })
        }
    }
}