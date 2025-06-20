// src/db.js
import Dexie from 'dexie';

export const db = new Dexie('ChatAssistantDB');

db.version(1).stores({
  messages: '++id, role, text, timestamp'
});

// Helper to add a message
export const addMessage = async (msg) => {
  // auto‑increments id, stores a JS Date timestamp
  await db.messages.add({ 
    role: msg.role, 
    text: msg.text, 
    timestamp: new Date().toISOString() 
  });
};

// Helper to get all messages in chronological order
export const getAllMessages = async () => {
  return db.messages.orderBy('timestamp').toArray();
};
