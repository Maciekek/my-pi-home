export function logger(req, res, next) {
  console.log(`Request...`);
  console.log(req.url);
  console.log(4, req);

  next();
}
