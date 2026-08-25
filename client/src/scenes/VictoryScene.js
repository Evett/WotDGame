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
            'Nyxaroth, the Shadow Guardian, has fallen.',
            '',
            'The barrier between the Shadow Plane and the Material Plane',
            'shatters like glass. Light pours through the rift as countless',
            'trapped souls surge toward freedom.',
            '',
            'The darkness recedes as you step back out into Loteria. Khan flies',
            'out, the shadowy tendrils of Tissandei around Alaen dissipating from',
            'where your bodies await you on top of the tower, being once again',
            'replaced by the shadows of Khan as he takes the form of an adult',
            'dragon. The headless version of Kamau from the Shadow Plane steps',
            'out and reaches for Kamau, their shadows melding together, flying apart',
            'and taking form again, mist twirling until it becomes flesh.',
            '',
            'Your journey in here is complete.',
            'Alaen, gain mythic tier 4 and 5. Everyone else, gain mythic tier 5.'
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
