import gameState from '../GameState.js';
import CharacterLibrary from '../data/CharacterLibrary.js';
import SceneManager from '../SceneManager.js';
import BaseScene from './BaseScene.js';

export class CharacterSelectScene extends BaseScene {
    constructor() {
        super({ key: 'CharacterSelectScene' });
    }

    create(data) {
        this.sceneManager = new SceneManager(this);
        this.createBackground();
        const { x, y } = this.getCenter();

        this.socket = data.socket;
        this.lobbyId = data.lobbyId;
        this.playerName = data.playerName;
        this.players = data.players;

        this.selectedCharacters = {};
        this.characterButtons = {};

        this.add.text(x, y-200, 'Choose Your Character', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        let yPos = y - 100;
        Object.keys(CharacterLibrary).forEach((charKey) => {
            const character = CharacterLibrary[charKey];

            const button = this.add.text(x, yPos, character.name, {
                fontSize: '24px',
                backgroundColor: '#333',
                padding: { x: 10, y: 5 },
                color: '#ffffff'
            }).setOrigin(0.5).setInteractive();

            button.on('pointerdown', () => {
                if (button.disabled) return;
                this.socket.emit('select-character', {
                    lobbyId: this.lobbyId,
                    playerId: this.socket.id,
                    characterKey: charKey
                });
            });

            this.characterButtons[charKey] = button;
            yPos += 50;
        });

        this.socket.on('character-selected', ({ playerId, characterKey, allSelected }) => {
            this.selectedCharacters[playerId] = characterKey;

            const button = this.characterButtons[characterKey];
            if (button) {
                button.setStyle({ backgroundColor: '#555' });
                button.disabled = true;
            }

            // If you are the one who selected it, store it
            if (playerId === this.socket.id) {
                gameState.setCharacter(CharacterLibrary[characterKey]);
            }

            if (allSelected) {
                this.time.delayedCall(500, () => {
                    this.sceneManager.switchScene('MapScene', {
                        socket: this.socket,
                        players: this.players,
                        playerId: this.socket.id,
                        lobbyId: this.lobbyId,
                        characters: this.selectedCharacters
                    });
                });
            }
        });
    }
}