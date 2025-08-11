// src/scenes/CharacterSelectScene.js
import gameState from '../GameState.js';
import CharacterLibrary from '../data/CharacterLibrary.js';
import SceneManager from '../SceneManager.js';
import BaseScene from './BaseScene';
import { playerId } from '../socket.js';

export class CharacterSelectScene extends BaseScene {
  constructor() {
    super({ key: 'CharacterSelectScene' });
  }

  create(data) {
    super.create();
    this.lobbyId = data.lobbyId;
    this.playerName = data.playerName;
    this.players = data.players;
    this.sceneManager = new SceneManager(this, this.socket, this.lobbyId);
    this.showScene();
  }

  showScene() {
    this.createBackground();
    const { x, y } = this.getCenter();

    this.selectedCharacters = {};
    this.characterButtons = {};

    this.add.text(x, y - 200, 'Choose Your Character', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);

    let yPos = y - 100;
    Object.keys(CharacterLibrary).forEach((charKey) => {
      const character = CharacterLibrary[charKey];

      const button = this.add.text(x, yPos, character.name, {
        fontSize: '24px', backgroundColor: '#333', padding: { x: 10, y: 5 }, color: '#fff'
      }).setOrigin(0.5).setInteractive();

      button.on('pointerdown', () => {
        if (button.disabled) return;
        this.socket.emit('select-character', { lobbyId: this.lobbyId, characterKey: charKey, requesterPlayerId: playerId });
      });

      this.characterButtons[charKey] = button;
      yPos += 50;
    });

    // Listen for character selections
    this.socket.on('character-selected', ({ playerId: chosenBy, characterKey, allSelected }) => {
      this.selectedCharacters[chosenBy] = characterKey;

      const button = this.characterButtons[characterKey];
      if (button) {
        button.setStyle({ backgroundColor: '#555' });
        button.disabled = true;
      }

      // If this selection is yours, set your gameState
      if (chosenBy === playerId) {
        gameState.setCharacter(CharacterLibrary[characterKey]);
        this.socket.emit('update-game-state', { gameState });
        // disable all your buttons so you can't pick again
        Object.values(this.characterButtons).forEach(btn => btn.disabled = true);
      }

      if (allSelected) {
        this.time.delayedCall(500, () => {
          this.sceneManager.setLobby(this.lobbyId);
          this.sceneManager.switchScene('MapScene', {
            playerId,
            gameState
          });
        });
      }
    });
  }
}
