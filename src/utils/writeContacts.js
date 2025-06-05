import { PATH_DB } from '../constants/contacts.js';
import { writeFile } from 'fs/promises';

export const writeContacts = async (contacts) => {
  try {
    const data = JSON.stringify(contacts, null, 2);
    await writeFile(PATH_DB, data);
  } catch (error) {
    console.error('Error writing contacts:', error.message);
    throw error;
  }
};
