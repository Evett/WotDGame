import MagicItem from "./MagicItem";

const createMagicItem = (options) => new MagicItem(options);

const magicItems = {
    AmuletOfVitality: createMagicItem({
        name: "Amulet of Vitality",
        description: "Start each battle with +5 max health.",
        type: "passive",
        isUsed: false,
        triggers: {
            onBattleStart: (state) => {
                state.gainHealth(5);
            }
        }
    }),

    WandOfFire: createMagicItem({
        name: "Wand of Fire",
        description: "Deal 10 damage to a random enemy. Usable once per combat.",
        type: "usable",
        isUsed: false,
        effect: (state, enemies) => {
            if (this.isUsed) return;
            const target = enemies[Math.floor(Math.random() * enemies.length)];
            target.takeDamage(10);
            this.isUsed = true;
        }
    })
};

const MagicItemLibrary = {
    magicItems,
    getRandom: () => Phaser.Utils.Array.GetRandom(Object.values(magicItems)),
    getRandomMagicItems(amount = 1) {
        const randomMagicItems = Phaser.Utils.Array.Shuffle(Object.values(magicItems)).slice(0, amount);
        return randomMagicItems;
    }
};

export default MagicItemLibrary;