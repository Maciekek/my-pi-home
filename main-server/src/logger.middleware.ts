export function logger(message, next) {
  console.log(new Date().toLocaleString(), message)
  next();
}
