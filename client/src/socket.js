// src/socket.js
import { io } from 'socket.io-client';

export function getOrCreatePlayerId() {
  let id = localStorage.getItem('playerId');
  if (!id) {
    // Use crypto.randomUUID if available
    id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : '_' + Math.random().toString(36).slice(2, 9);
    localStorage.setItem('playerId', id);
  }
  return id;
}

export const playerId = getOrCreatePlayerId();

export const socket = io({
  auth: { playerId },
  autoConnect: true,
});
