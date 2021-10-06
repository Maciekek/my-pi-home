export function logger(req, res, next) {
  console.log(`Request...`);
  console.log(req.url);

  next();
}
