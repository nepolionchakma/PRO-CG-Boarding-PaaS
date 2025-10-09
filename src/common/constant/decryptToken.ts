import CryptoJS from 'crypto-js';
import {cryptoTokenKey} from '../../../App';

export const decrypt = (value: string) => {
  try {
    // Decode URL-safe string
    const decoded = decodeURIComponent(value);

    const bytes = CryptoJS.AES.decrypt(decoded, cryptoTokenKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);

    return plaintext;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};
