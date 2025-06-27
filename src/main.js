import { MenuScene } from './scenes/MenuScene';
import { MapScene } from './scenes/MapScene';
import { BattleScene } from './scenes/BattleScene';
import { EventScene } from './scenes/EventScene';
import { BossScene } from './scenes/BossScene';
import { AltarScene } from './scenes/AltarScene';
import { DeckScene } from './scenes/DeckScene';
import { CharacterSelectScene } from './scenes/CharacterSelectScene';
import { GameOverScene } from './scenes/GameOverScene';
import { CardRewardScene } from './scenes/CardRewardScene';
import { RestSiteScene } from './scenes/RestSiteScene';
import { ShopScene } from './scenes/ShopScene';
import { UpgradeScene } from './scenes/UpgradeScene';
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
        GameOverScene,
        CardRewardScene,
        RestSiteScene,
        ShopScene,
        UpgradeScene
    ]
};

new Phaser.Game(config);
