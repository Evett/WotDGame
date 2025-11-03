import Phaser from 'phaser';
import { StartingScene } from './scenes/StartingScene';
import { CharacterSelectScene } from './scenes/CharacterSelectScene';
import { BeginningChoiceScene } from './scenes/BeginningChoiceScene';
import { AltarScene } from './scenes/AltarScene';
import { CardRewardScene } from './scenes/CardRewardScene';
import { DeckScene } from './scenes/DeckScene';
import { EventScene } from './scenes/EventScene';
import { RestScene } from './scenes/RestScene';
import { ShopScene } from './scenes/ShopScene';

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
        BeginningChoiceScene,
        AltarScene,
        CardRewardScene,
        DeckScene,
        EventScene,
        RestScene,
        ShopScene
    ],
    dom: {
        createContainer: true
    }
};

const game = new Phaser.Game(config);