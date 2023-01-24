import { Request } from 'express';

export function logger(req: Request, res, next) {
  console.log(`${new Date().toLocaleString()}, Request...`);
  console.log(req.url);
  console.log(4,1, req.method);

  next();
}
