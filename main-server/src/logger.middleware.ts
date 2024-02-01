import { Request } from 'express';

export function logger(req: Request, res, next) {
  console.log(`[${new Date().toLocaleString()}], Request: ${req.method} ${req.url}`);

  next();
}
