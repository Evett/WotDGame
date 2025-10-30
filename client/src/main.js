import Phaser from 'phaser';
import { StartingScene } from './scenes/StartingScene';
import { CharacterSelectScene } from './scenes/CharacterSelectScene';
import { BeginningChoiceScene } from './scenes/BeginningChoiceScene';

const config = {
    title: 'WotDGame',
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#192a56',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        StartingScene,
        CharacterSelectScene,
        BeginningChoiceScene
    ],
    dom: {
        createContainer: true
    }
};

const game = new Phaser.Game(config);