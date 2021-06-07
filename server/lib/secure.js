// @ts-check

import crypto from 'crypto';

/**
 * @param {string} value
 */
//export default (value) => crypto.createHash('sha256')
//  .update(value)
 // .digest('hex');
 export default (value) => {
  const secret = process.env.CRYPTOWORD;
  return crypto.createHmac('sha256', secret)
    .update(value)
    .digest('hex');
};