import { Request } from 'express';

export function logger(req: Request, res, next) {
  console.log(`Request...`);
  console.log(req.url);
  console.log(4, req.method);

  next();
}
