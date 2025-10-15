// encryption.js
import CryptoJS from 'crypto-js';
import {secretKey} from '../../../App'; // Make sure this is 32 chars

const key = CryptoJS.enc.Utf8.parse(secretKey);
const iv = CryptoJS.enc.Utf8.parse(secretKey.substring(0, 16)); // safer separate IV

export const makeEncryption = data => {
  try {
    if (!data || typeof data !== 'string' || !data.trim()) {
      throw new Error('Invalid data for encryption');
    }

    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();

    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

export const makeDecryption = data => {
  try {
    if (!data || typeof data !== 'string' || !data.trim()) {
      throw new Error('Invalid data for decryption');
    }

    const decryptedBytes = CryptoJS.AES.decrypt(data, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedText.trim()) {
      throw new Error('Empty decrypted text');
    }

    try {
      return JSON.parse(decryptedText);
    } catch {
      return decryptedText; // in case it's plain string
    }
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// src/api/encryption.ts
// import CryptoJS from "crypto-js";
// import { secretKey } from "../../../App"; // Make sure this is 32 chars

// const key = CryptoJS.enc.Utf8.parse(secretKey);
// const iv = CryptoJS.enc.Utf8.parse(secretKey.substring(0, 16)); // safer separate IV

// export const makeEncryption = (data: string): string | null => {
//   try {
//     if (!data || typeof data !== "string" || !data.trim()) {
//       throw new Error("Invalid data for encryption");
//     }

//     const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
//       keySize: 128 / 8,
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7,
//     }).toString();

//     return encrypted;
//   } catch (error) {
//     console.error("Encryption error:", error);
//     return null;
//   }
// };

// export const makeDecryption = (data: string): any | null => {
//   try {
//     if (!data || typeof data !== "string" || !data.trim()) {
//       throw new Error("Invalid data for decryption");
//     }

//     const decryptedBytes = CryptoJS.AES.decrypt(data, key, {
//       keySize: 128 / 8,
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7,
//     });

//     const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
//     if (!decryptedText.trim()) throw new Error("Empty decrypted text");

//     try {
//       return JSON.parse(decryptedText);
//     } catch {
//       return decryptedText; // in case it's plain string
//     }
//   } catch (error) {
//     console.error("Decryption error:", error);
//     return null;
//   }
// };
