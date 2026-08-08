import BaseScene from './BaseScene';

export class VictoryScene extends BaseScene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    create(data) {
        super.create();
        this.service = data.service;
        this.playMusic('bgm_victory');
        this.createBackground(0x0a0a1a);

        const { width, height } = this.scale;
        const cx = width / 2;

        // Title
        this.add.text(cx, height * 0.15, 'THE GATE IS OPEN', {
            fontSize: '56px', color: '#ff88ff', fontStyle: 'bold'
        }).setOrigin(0.5);

        // Lore text
        const loreText = [
            'Nyxaroth, the Shadow Gate Guardian, has fallen.',
            '',
            'The barrier between the Shadow Plane and the Material Plane',
            'shatters like glass. Light pours through the rift as countless',
            'trapped souls surge toward freedom.',
            '',
            'The darkness recedes. The world breathes again.',
            '',
            'Your journey through the Wastes of the Damned is complete.'
        ].join('\n');

        this.add.text(cx, height * 0.45, loreText, {
            fontSize: '18px', color: '#ccccee', align: 'center',
            lineSpacing: 6, wordWrap: { width: width * 0.7 }
        }).setOrigin(0.5);

        // Player stats
        const gameState = this.service.getMyGameState();
        const statsText = `${gameState.character?.name || 'Hero'} the ${gameState.characterClass || 'Adventurer'}\nHP: ${gameState.health}/${gameState.maxHealth} | Gold: ${gameState.gold} | Level: ${gameState.level}`;
        this.add.text(cx, height * 0.72, statsText, {
            fontSize: '16px', color: '#aaaacc', align: 'center'
        }).setOrigin(0.5);

        // Victory banner
        this.add.text(cx, height * 0.82, '⭐  VICTORY  ⭐', {
            fontSize: '40px', color: '#ffdd44', fontStyle: 'bold'
        }).setOrigin(0.5);

        // Pulsing glow effect on title
        this.tweens.add({
            targets: this.children.list[1],
            alpha: { from: 1, to: 0.6 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        this.createSceneListener(this.service);
    }
}
