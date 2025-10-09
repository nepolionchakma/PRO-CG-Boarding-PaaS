import CryptoJS from 'crypto-js';
const CRYPTO_SECRET_KEY = '6z4n';
const crptoSecretKey = CRYPTO_SECRET_KEY;
export const decrypt = (value: string) => {
  try {
    // Decode URL-safe string
    const decoded = decodeURIComponent(value);

    const bytes = CryptoJS.AES.decrypt(decoded, crptoSecretKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);

    return plaintext; // original string
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};
