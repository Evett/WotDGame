import { MenuScene } from '../src/scenes/MenuScene';
import { MapScene } from '../src/scenes/MapScene';
import { BattleScene } from '../src/scenes/BattleScene';
import { EventScene } from '../src/scenes/EventScene';
import { BossScene } from '../src/scenes/BossScene';
import { AltarScene } from '../src/scenes/AltarScene';
import { DeckScene } from '../src/scenes/DeckScene';
import { CharacterSelectScene } from '../src/scenes/CharacterSelectScene';
import { GameOverScene } from '../src/scenes/GameOverScene';
import { CardRewardScene } from '../src/scenes/CardRewardScene';
import { RestSiteScene } from '../src/scenes/RestSiteScene';
import { ShopScene } from '../src/scenes/ShopScene';
import { UpgradeScene } from '../src/scenes/UpgradeScene';
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
    ],
    dom: {
        createContainer: true
    }
};

new Phaser.Game(config);
