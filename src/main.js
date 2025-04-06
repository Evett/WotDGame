import { Preloader } from './scenes/Preloader';
import { Play } from './scenes/Play';
import { MenuScene } from './scenes/MenuScene';
import { MapScene } from './scenes/MapScene';
import { BattleScene } from './scenes/BattleScene';
import { EventScene } from './scenes/EventScene';
import { BossScene } from './scenes/BossScene';
import { AltarScene } from './scenes/AltarScene';
import { DeckScene } from './scenes/DeckScene';
import { CharacterSelectScene } from './scenes/CharacterSelectScene';
import Phaser from 'phaser';

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
        MenuScene,
        MapScene,
        BattleScene,
        EventScene,
        BossScene,
        AltarScene,
        DeckScene,
        CharacterSelectScene,
        Preloader,
        Play
    ]
};

new Phaser.Game(config);
