import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// https://www.geeksforgeeks.org/node-js-password-hashing-crypto-module/
// const secret = 'abcdefg';
// const hash = createHmac('sha256', secret)
//   .update('I love cupcakes')
//   .digest('hex');

export const hashPassword = async (password: string) => {
  const salt = randomBytes(8).toString('hex');
  const key = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}.${key.toString('hex')}`;
};

export const comparePassword = async (providedPass: string, storedPass: string) => {
  const [salt, key] = storedPass.split('.');
  const keyBuffer = (await scryptAsync(providedPass, salt as string, 64)) as Buffer;
  return keyBuffer.toString('hex') === key;
};
