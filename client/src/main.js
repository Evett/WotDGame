import Phaser from 'phaser';
import { StartingScene } from './scenes/StartingScene';

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
        StartingScene
    ],
    dom: {
        createContainer: true
    }
};

insertCoin({
        maxPlayers: 6,
        persistentMode: true,
        reconnectGracePeriod: 10
      }).then(() => {
  const game = new Phaser.Game(config);
});
