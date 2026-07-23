import BaseScene from './BaseScene';

const NARRATIVES = [
    {
        title: "Ambush on the Road",
        text: "As you round a bend in the forest path, arrows whistle through the trees. Figures emerge from the undergrowth, weapons drawn and hungry for blood.",
        boss: false
    },
    {
        title: "The Cursed Ruins",
        text: "You stumble upon ancient ruins pulsing with dark energy. The stones shift and crack as twisted creatures claw their way out of the earth.",
        boss: false
    },
    {
        title: "Raiding Party",
        text: "Smoke rises in the distance. A band of raiders blocks the road ahead, their leader pointing directly at your group with a cruel grin.",
        boss: false
    },
    {
        title: "Disturbed Rest",
        text: "The ground beneath your campsite begins to tremble. Something ancient has been awakened by your presence, and it is not pleased.",
        boss: false
    },
    {
        title: "Trapped!",
        text: "A narrow canyon seemed like a shortcut, but the walls begin to close. Creatures drop from above, cutting off any retreat.",
        boss: false
    },
    {
        title: "The Bridge Toll",
        text: "A rickety bridge spans a bottomless chasm. Halfway across, monstrous shapes rise from below. There's no turning back now.",
        boss: false
    },
    {
        title: "Dark Ritual",
        text: "You interrupt a circle of cultists mid-incantation. Their summoning is incomplete, but the half-formed abomination turns its gaze upon you.",
        boss: false
    },
    {
        title: "Territorial Beasts",
        text: "You've wandered into a nest. The creatures here don't take kindly to intruders, and their young screech in alarm as the adults charge.",
        boss: false
    },
    // Boss narratives
    {
        title: "The Dragon's Lair",
        text: "The air grows unbearably hot. A cavern opens before you, filled with glittering gold and bones. A massive eye opens in the darkness... the Dragon awakens.",
        boss: true
    },
    {
        title: "The Lich's Sanctum",
        text: "Necrotic energy crackles through the air as you breach the inner sanctum. A skeletal figure in tattered robes rises from its throne, phylactery pulsing with unholy light.",
        boss: true
    },
    {
        title: "Champion of Darkness",
        text: "The ground shakes as a towering figure emerges from a portal of shadow. This is no ordinary foe — this is a champion of the forces that seek your destruction.",
        boss: true
    }
];

export class NarrativeScene extends BaseScene {
    constructor() {
        super({ key: 'NarrativeScene' });
    }

    create(data) {
        super.create();
        this.service = data.service;
        this.createBackground(0x0e0e1a);
        this.createInventoryButton(this.service);

        const { x, y } = this.getCenter();

        // Increment battle count (host only to avoid double-counting)
        if (this.service.isHost()) {
            this.service.incrementBattleCount();
        }

        // Determine if this is a boss fight
        const isBoss = this.service.isBossBattle();

        // Host picks a narrative and shares it; others wait for room state
        if (this.service.isHost()) {
            const narrative = this.pickNarrative(isBoss);
            this.service.setRoomState('currentNarrative', { title: narrative.title, text: narrative.text, boss: narrative.boss });
            this.showNarrative(narrative, isBoss);
        } else {
            const stored = this.service.getRoomState('currentNarrative');
            if (stored) {
                this.showNarrative(stored, isBoss);
            } else {
                // Wait for host to set the narrative
                this.add.text(x, y, 'Preparing encounter...', {
                    fontSize: '18px', color: '#888'
                }).setOrigin(0.5);

                this.time.addEvent({
                    delay: 200, loop: true,
                    callback: () => {
                        const narrativeData = this.service.getRoomState('currentNarrative');
                        if (narrativeData) {
                            this.scene.restart({ service: this.service });
                        }
                    }
                });
            }
        }

        this.createSceneListener(this.service);
    }

    showNarrative(narrative, isBoss) {
        const { x, y } = this.getCenter();

        // Boss indicator
        if (isBoss) {
            this.add.text(x, y - 280, '💀 BOSS BATTLE APPROACHING 💀', {
                fontSize: '20px', color: '#ff4444', fontStyle: 'bold'
            }).setOrigin(0.5);
        }

        // Title
        this.add.text(x, y - 200, narrative.title, {
            fontSize: '30px', color: isBoss ? '#ffaa00' : '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        // Narrative text (typewriter-style reveal)
        this.narrativeText = this.add.text(x, y - 80, '', {
            fontSize: '18px', color: '#cccccc',
            wordWrap: { width: 650 }, align: 'center', lineSpacing: 8
        }).setOrigin(0.5);

        this.typewriterText(narrative.text, () => {
            this.showContinueButton(isBoss);
        });
    }

    typewriterText(fullText, onComplete) {
        let index = 0;
        this.time.addEvent({
            delay: 30,
            repeat: fullText.length - 1,
            callback: () => {
                index++;
                this.narrativeText.setText(fullText.substring(0, index));
                if (index >= fullText.length && onComplete) {
                    onComplete();
                }
            }
        });
    }

    showContinueButton(isBoss) {
        const { x, y } = this.getCenter();

        const btnText = isBoss ? '⚔ Face the Boss' : '⚔ Engage!';
        const btnColor = isBoss ? '#ffaa00' : '#ff6644';

        const continueBtn = this.add.text(x, y + 100, btnText, {
            fontSize: '24px', backgroundColor: '#2a0a0a',
            padding: { x: 24, y: 12 }, color: btnColor, fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        continueBtn.on('pointerover', () => continueBtn.setStyle({ backgroundColor: '#4a1a1a' }));
        continueBtn.on('pointerout', () => continueBtn.setStyle({ backgroundColor: '#2a0a0a' }));
        continueBtn.on('pointerdown', () => {
            this.service.setRoomState('currentNarrative', null);
            this.service.broadcastSceneSwitch('BattleScene');
        });

        // Fade in
        continueBtn.setAlpha(0);
        this.tweens.add({
            targets: continueBtn,
            alpha: 1,
            duration: 500
        });
    }

    pickNarrative(isBoss) {
        const pool = NARRATIVES.filter(n => n.boss === isBoss);
        return pool[Math.floor(Math.random() * pool.length)];
    }
}
