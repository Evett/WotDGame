import BaseScene from './BaseScene';
import EnemyLibrary from '../data/EnemyLibrary';

// Narratives keyed by enemy name for bosses
const BOSS_NARRATIVES = {
    "Ancient Dragon": {
        title: "The Dragon's Lair",
        text: "The air grows unbearably hot. A cavern opens before you, filled with glittering gold and charred bones. A massive eye opens in the darkness... the Ancient Dragon awakens, its scales gleaming like molten iron."
    },
    "Lich King": {
        title: "The Lich's Sanctum",
        text: "Necrotic energy crackles through the air as you breach the inner sanctum. The Lich King rises from its bone throne, phylactery pulsing with unholy light. The dead answer his call."
    },
    "Iron Colossus": {
        title: "The Forge of Ruin",
        text: "The ground trembles with each thunderous step. Before you stands the Iron Colossus — a titan of living metal forged in an age of war. Its eyes glow furnace-red as gears grind to life."
    },
    "Demon Prince": {
        title: "The Abyssal Throne",
        text: "A rift of hellfire tears open the sky. The Demon Prince steps through, wreathed in shadow and brimstone. His laughter echoes across the plane as lesser fiends grovel at his hooves."
    }
};

// Encounter flavor text keyed by enemy name
const ENCOUNTER_NARRATIVES = {
    "Goblin": "A band of goblins scrambles out from the brush, crude weapons raised and yellow eyes gleaming with greed.",
    "Slime": "The ground squelches beneath your feet. Acidic ooze pools around you as amorphous shapes rise, hungry and mindless.",
    "Skeleton": "Bones rattle in the darkness. Ancient warriors claw their way from shallow graves, hollow eyes burning with cursed purpose.",
    "Bandit": "A group of bandits blocks the road ahead, their leader cracking his knuckles with a cruel grin. 'Your gold or your life.'",
    "Wolf Pack": "Snarling wolves emerge from the treeline, their alpha fixing you with a predatory stare. The pack circles, cutting off escape.",
    "Orc": "War drums echo through the valley. Orc raiders charge from the hills, axes raised and battle cries shaking the air.",
    "Giant Spider": "Webs coat the path ahead. Enormous spiders descend from the canopy, mandibles clicking with anticipation.",
    "Wraith": "The temperature plummets. Spectral figures materialize from the mist, their hollow wails chilling you to the bone.",
    "Dark Cultist": "Hooded figures interrupt their dark ritual to face you. The half-formed summoning circle pulses with malevolent energy.",
    "Frost Witch": "Ice crystallizes in the air around a pale figure. The Frost Witch raises her staff, and the world turns cold.",
    "Harpy": "Piercing shrieks rain down from above. Harpies dive from their cliff perches, talons extended.",
    "Shadow Assassin": "Shadows move where they shouldn't. Blades flash in the darkness as assassins emerge from impossible hiding spots.",
    "Ogre Brute": "The earth shakes as a massive ogre lumbers into view, dragging a tree trunk it uses as a club.",
    "Stone Golem": "Ancient stone guardians awaken, their carved runes flaring to life. They were built to protect this place — from you.",
    "Fire Elemental": "A column of flame erupts from the ground, taking shape. The fire elemental roars, scorching everything nearby.",
    "Vampire Spawn": "Pale figures with blood-red eyes step from the shadows. Their master may be absent, but their hunger remains.",
    "Minotaur": "A thunderous bellow echoes through the corridors. The Minotaur rounds the corner, horns lowered for a charge.",
    "Plague Bear": "A diseased beast stumbles from the corrupted woods, its matted fur oozing pestilence. It charges with mindless fury.",
    "Bone Knight": "Armored skeletons march in formation, their ancient discipline intact even in undeath. A bone knight raises its shield."
};

const GENERIC_INTROS = [
    "You round a bend and come face to face with danger.",
    "The path ahead is blocked. Steel yourselves.",
    "A hostile presence reveals itself. Prepare for battle.",
    "Enemies emerge from the surroundings. There's no avoiding this fight."
];

export class NarrativeScene extends BaseScene {
    constructor() {
        super({ key: 'NarrativeScene' });
    }

    create(data) {
        super.create();
        this.service = data.service;
        this.playMusic('bgm_explore');
        this.createBackground(0x0e0e1a);
        this.createInventoryButton(this.service);

        const { x, y } = this.getCenter();

        // Increment battle count (host only to avoid double-counting)
        if (this.service.isHost()) {
            this.service.incrementBattleCount();

            // Scale difficulty based on progress
            const count = this.service.getBattleCount();
            const difficulty = Math.min(Math.ceil(count / 3), 3);
            this.service.setRoomState('battleDifficulty', difficulty);
        }

        // Determine if this is the final boss or a regular boss fight
        const isFinalBoss = this.service.isFinalBoss();
        const isBoss = isFinalBoss || this.service.isBossBattle();

        // Host picks encounter + matching narrative, shares via room state
        if (this.service.isHost()) {
            const playerCount = this.service.getAllPlayers().length || 1;
            let narrative;

            if (isFinalBoss) {
                narrative = this.getFinalBossNarrative();
            } else {
                // Pre-roll the encounter to generate a matching narrative
                const difficulty = this.service.getRoomState('battleDifficulty') || 1;
                let enemies;
                if (this.service.isBossBattle()) {
                    enemies = EnemyLibrary.getBossEncounter(playerCount);
                } else {
                    enemies = EnemyLibrary.getRandomEncounter(difficulty, playerCount);
                }

                // Store the pre-rolled encounter so BattleScene uses the same one
                const serialized = enemies.map(e => e.serialize());
                this.service.setRoomState('preRolledEncounter', serialized);

                narrative = this.generateNarrative(enemies, isBoss);
            }

            this.service.setRoomState('currentNarrative', { title: narrative.title, text: narrative.text, boss: isBoss });
            this.showNarrative(narrative, isBoss);
        } else {
            const stored = this.service.getRoomState('currentNarrative');
            if (stored) {
                this.showNarrative(stored, isBoss);
            } else {
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

    generateNarrative(enemies, isBoss) {
        if (isBoss && enemies.length > 0) {
            const bossName = enemies[0].name;
            const match = BOSS_NARRATIVES[bossName];
            if (match) return match;
            return { title: `${bossName} Appears!`, text: `A fearsome ${bossName} blocks your path. Steel yourselves — this will be a fight for survival.` };
        }

        // Regular encounter: use the first enemy's name for flavor text
        const names = enemies.map(e => e.name);
        const uniqueNames = [...new Set(names)];
        const primaryName = enemies[0]?.name;

        const flavorText = ENCOUNTER_NARRATIVES[primaryName]
            || GENERIC_INTROS[Math.floor(Math.random() * GENERIC_INTROS.length)];

        const title = uniqueNames.length === 1
            ? (enemies.length > 1 ? `${uniqueNames[0]}s` : `${uniqueNames[0]} Encounter`)
            : `${uniqueNames[0]} & Allies`;

        return { title, text: flavorText };
    }

    getFinalBossNarrative() {
        return {
            title: "The Shadow Gate",
            text: "The air grows cold and still. Before you looms a rift of pure darkness — the gate between the Shadow Plane and the Material Plane. Chained souls writhe at its edges, unable to pass through.\n\nA massive figure materializes from the void. Nyxaroth, the Shadow Gate Guardian, towers before you. Its eyes burn with hollow violet light.\n\n\"None shall pass. These souls are MINE.\"\n\nThis is the final battle. Everything you've fought for comes down to this moment.",
            boss: true
        };
    }
}
