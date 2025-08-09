import { io } from 'socket.io-client';

function getPlayerId() {
  let id = localStorage.getItem('playerId');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('playerId', id);
  }
  return id;
}

export const playerId = getPlayerId();

export const socket = io({
  auth: { playerId },
  autoConnect: true,
});
