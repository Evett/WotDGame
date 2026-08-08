import BaseScene from './BaseScene';

export class GameOverScene extends BaseScene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create(data) {
        super.create();
        this.service = data.service;
        this.playMusic('bgm_gameover');
        this.createBackground(0x0a0000);

        const { width, height } = this.scale;
        const cx = width / 2;

        this.add.text(cx, height * 0.25, 'GAME OVER', {
            fontSize: '56px', color: '#ff2222', fontStyle: 'bold'
        }).setOrigin(0.5);

        const gameState = this.service.getMyGameState();
        const charName = gameState.character?.name || 'Hero';
        const battles = this.service.getBattleCount();

        this.add.text(cx, height * 0.4, `${charName} has fallen after ${battles} battles.`, {
            fontSize: '20px', color: '#cc8888'
        }).setOrigin(0.5);

        this.add.text(cx, height * 0.5, `Level: ${gameState.level} | Gold: ${gameState.gold}`, {
            fontSize: '16px', color: '#886666'
        }).setOrigin(0.5);

        const restartBtn = this.add.text(cx, height * 0.65, 'Return to Lobby', {
            fontSize: '24px', backgroundColor: '#333333',
            padding: { x: 20, y: 10 }, color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        restartBtn.on('pointerover', () => restartBtn.setStyle({ backgroundColor: '#555555' }));
        restartBtn.on('pointerout', () => restartBtn.setStyle({ backgroundColor: '#333333' }));
        restartBtn.on('pointerdown', () => {
            // Reset game state for fresh run
            this.service.setRoomState('battleCount', 0);
            this.service.setRoomState('battleDifficulty', 1);
            this.service.setFinalBoss(false);
            this.service.broadcastSceneSwitch('StartingScene');
        });

        this.createSceneListener(this.service);
    }
}
