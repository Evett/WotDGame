import BaseScene from './BaseScene';
import MagicItemLibrary from '../data/MagicItemLibrary';

export class BossRewardScene extends BaseScene {
    constructor() {
        super({ key: 'BossRewardScene' });
    }

    create(data) {
        super.create();
        this.service = data.service;
        this.createBackground(0x1a0a2a);
        this.createInventoryButton(this.service);
        this.choiceMade = false;
        this.gameState = this.service.getMyGameState();

        const { x, y } = this.getCenter();

        this.add.text(x, y - 280, '🏆 Boss Defeated!', {
            fontSize: '34px', color: '#ffaa00', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(x, y - 230, 'Choose a magic item as your reward:', {
            fontSize: '16px', color: '#cccccc'
        }).setOrigin(0.5);

        // Host picks the 2 items and shares them
        if (this.service.isHost()) {
            const items = MagicItemLibrary.getRandomMagicItems(2);
            const itemData = items.map(item => ({
                id: item.id,
                name: item.name,
                description: item.description,
                type: item.type
            }));
            this.service.setRoomState('bossRewardItems', itemData);
            this.showItems(itemData);
        } else {
            const stored = this.service.getRoomState('bossRewardItems');
            if (stored) {
                this.showItems(stored);
            } else {
                this.add.text(x, y, 'Loading rewards...', { fontSize: '18px', color: '#888' }).setOrigin(0.5);
                this.time.addEvent({
                    delay: 200, loop: true,
                    callback: () => {
                        const items = this.service.getRoomState('bossRewardItems');
                        if (items) this.scene.restart({ service: this.service });
                    }
                });
            }
        }

        // Waiting indicator
        this.waitingText = this.add.text(x, y + 200, '', {
            fontSize: '16px', color: '#888'
        }).setOrigin(0.5);

        // Poll for all done
        this.time.addEvent({
            delay: 500, loop: true,
            callback: () => this.checkAllDone()
        });

        this.createSceneListener(this.service);
    }

    showItems(itemData) {
        const { x, y } = this.getCenter();
        const cardWidth = 220;
        const gap = 40;
        const totalWidth = itemData.length * cardWidth + (itemData.length - 1) * gap;
        const startX = x - totalWidth / 2 + cardWidth / 2;

        itemData.forEach((item, index) => {
            const ix = startX + index * (cardWidth + gap);

            const container = this.add.container(ix, y - 40);

            const bg = this.add.rectangle(0, 0, cardWidth, 200, 0x2a1a4a)
                .setStrokeStyle(2, 0xaa44ff)
                .setInteractive({ useHandCursor: true });

            const typeColor = item.type === 'passive' ? '#88ff88' : '#ff8844';
            const typeLabel = this.add.text(0, -75, item.type.toUpperCase(), {
                fontSize: '11px', color: typeColor, fontStyle: 'bold'
            }).setOrigin(0.5);

            const nameText = this.add.text(0, -50, item.name, {
                fontSize: '16px', color: '#ffffff', fontStyle: 'bold',
                wordWrap: { width: cardWidth - 20 }, align: 'center'
            }).setOrigin(0.5);

            const descText = this.add.text(0, 10, item.description, {
                fontSize: '13px', color: '#cccccc',
                wordWrap: { width: cardWidth - 24 }, align: 'center'
            }).setOrigin(0.5);

            container.add([bg, typeLabel, nameText, descText]);

            bg.on('pointerover', () => bg.setStrokeStyle(3, 0xffcc00));
            bg.on('pointerout', () => bg.setStrokeStyle(2, 0xaa44ff));
            bg.on('pointerdown', () => this.chooseItem(item, container));
        });

        // Skip button
        const skipBtn = this.add.text(x, y + 120, 'Skip', {
            fontSize: '16px', color: '#888888', backgroundColor: '#222222',
            padding: { x: 16, y: 8 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        skipBtn.on('pointerdown', () => this.chooseItem(null, null));
    }

    chooseItem(item, container) {
        if (this.choiceMade) return;
        this.choiceMade = true;

        const { x, y } = this.getCenter();

        if (item) {
            const fullItem = MagicItemLibrary.getById(item.id);
            if (fullItem && !this.gameState.hasMagicItem(item.id)) {
                this.gameState.addMagicItem(fullItem);
                this.service.saveMyGameState(this.gameState);

                this.add.text(x, y + 150, `Acquired: ${item.name}!`, {
                    fontSize: '20px', color: '#aa44ff', fontStyle: 'bold'
                }).setOrigin(0.5);
            } else {
                this.add.text(x, y + 150, 'Already owned — skipped.', {
                    fontSize: '16px', color: '#888'
                }).setOrigin(0.5);
            }
        } else {
            this.add.text(x, y + 150, 'Skipped item reward.', {
                fontSize: '16px', color: '#888'
            }).setOrigin(0.5);
        }

        this.waitingText.setText('Waiting for other players...');
        this.markDone();
    }

    markDone() {
        const player = this.service.getMyPlayer();
        const doneMap = this.service.getRoomState('bossRewardDone') || {};
        doneMap[player.id] = true;
        this.service.setRoomState('bossRewardDone', doneMap);
    }

    checkAllDone() {
        if (this.transitioned) return;
        const allPlayers = this.service.getAllPlayers();
        if (allPlayers.length === 0) return;

        const doneMap = this.service.getRoomState('bossRewardDone') || {};
        const allDone = allPlayers.every(p => doneMap[p.id] === true);

        if (allDone) {
            this.transitioned = true;
            this.service.setRoomState('bossRewardDone', null);
            this.service.setRoomState('bossRewardItems', null);
            this.service.broadcastSceneSwitch('CardRewardScene');
        }
    }
}
