// src/db.js
import Dexie from 'dexie';

export const db = new Dexie('ChatAssistantDB');
db.version(1).stores({
  messages: '++id, role, text, timestamp'
});

// add a message
export const addMessage = msg =>
  db.messages.add({ ...msg, timestamp: new Date().toISOString() });

// get all messages
export const getAllMessages = () =>
  db.messages.orderBy('timestamp').toArray();

// CLEAR helper—wipe the entire messages store
export const clearMessages = () =>
  db.messages.clear();
