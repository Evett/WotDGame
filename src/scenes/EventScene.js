import SceneManager from '../SceneManager';
import BaseScene from './BaseScene';
import gameState from '../GameState.js';
import EventLibrary from '../data/EventLibrary.js';
import EventTags from '../data/EventTags.js';

export class EventScene extends BaseScene {
    constructor() {
        super({ key: 'EventScene' });
    }

    preload() {
    }

    create() {
        this.sceneManager = new SceneManager(this);
        this.createBackground();
        const { x, y } = this.getCenter();

        const event = EventLibrary.getRandomMatching(event => gameState.health > 10 || !event.tags.includes(EventTags.RISKY));

        console.log("Starting event:", event);

        this.renderEvent(event, x, y);

        // Title
        this.add.text(x, y-100, 'EventScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        let returnToMapButton = this.add.text(x, y, 'Return to Map', { fontSize: '24px', backgroundColor: '' })
            .setOrigin(0.5)
            .setInteractive();

        returnToMapButton.on('pointerdown', () => {
            this.sceneManager.switchScene('MapScene');
        });
    }

    renderEvent(event, x, y) {
        this.add.text(x, 100, event.title, {
            fontSize: '28px',
            color: '#fff'
        }).setOrigin(0.5);

        this.add.text(x, 160, event.description, {
            fontSize: '18px',
            color: '#ccc',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);

        event.choices.forEach((choice, index) => {
            const buttonY = 260 + index * 60;
            const button = this.add.text(x, buttonY, choice.text, {
                fontSize: '20px',
                color: '#ffcc00',
                backgroundColor: '#444',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            button.on('pointerdown', () => {
                choice.effect(gameState, this);
            });
        });
    }
}