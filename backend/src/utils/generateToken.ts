import crypto from 'crypto';
import ShortUniqueId from 'short-unique-id';

/**
 * To generate unique ids and OTP and allow user to specify the number of unique id to be generated.
 * @param max number - The maximum length of the unique ID to be generated
 * @returns
 */
export const generateUniqueId = (max: number) => {
  const uid = new ShortUniqueId({ length: max });
  return uid.rnd();
};

/**
 * This function generates plain token from crypto library.
 * @returns crypto generated token - return type: string
 */
const createCryptoToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * This function generates hashed token from crypto library.
 * @param token:string the plain token to be hashed
 * @returns crypto generated hashed token - return type: string
 */
const hashCryptoToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Generate crypto type annotation
type TokenType = 'plain' | 'hash';
type Token = {
  type?: TokenType;
  token?: string;
};

/**
 *The function accept the type of token to be generated and token (optional - only when generating hashed token).
 *
 *If nothing is specified, it generates both hash and plain token.
 * @param type accept any of these paramaters - 'plain' | 'hash' ;
 * @param token accept plain token that will be hashed ;
 * @returns string | string[] -
 */
const generateToken = ({ type, token }: Token) => {
  if (type === 'plain') {
    return createCryptoToken();
  }
  if (type === 'hash' && token) {
    return hashCryptoToken(token);
  }
  const newToken = createCryptoToken();
  const hashedToken = hashCryptoToken(newToken);
  return [newToken, hashedToken];
};

export default generateToken;
