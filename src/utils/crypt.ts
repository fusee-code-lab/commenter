import bcrypt from 'bcrypt';

// https://pkg.go.dev/golang.org/x/crypto/bcrypt#DefaultCost
const DEFAULT_COST = 10;

export function hashRawPassword(password: string) {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(password, DEFAULT_COST, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

export function comparePasswordWithSecret(password: string, secret: string) {
  return new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(password, secret, (err, same) => {
      if (err) {
        reject(err);
      } else {
        resolve(same);
      }
    });
  });
}