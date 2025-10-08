import MagicItem from "./MagicItem";

const createMagicItem = (options) => new MagicItem(options);

const magicItems = {
    AmuletOfVitality: createMagicItem({
        id: "amulet_of_vitality",
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
        id: "wand_of_fire",
        name: "Wand of Fire",
        description: "Deal 10 damage to a random enemy. Usable once per combat.",
        type: "usable",
        isUsed: false,
        effect: (_, state, scene) => {
            const randomTarget = state.enemies[Math.floor(Math.random() * state.enemies.length)];
            console.log("Target takes 10 damage from Wand of Fire:", randomTarget);
            randomTarget.takeDamage(10);
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