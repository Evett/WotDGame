import MagicItem from './MagicItem.js';

const createMagicItem = (options) => new MagicItem(options);

const magicItems = {
    AmuletOfVitality: () => createMagicItem({
        id: "amulet_of_vitality",
        name: "Amulet of Vitality",
        description: "Start each battle with +5 max health.",
        type: "passive",
        triggers: {
            onBattleStart: (state) => {
                state.gainHealth(5);
            }
        }
    }),

    WandOfFire: () => createMagicItem({
        id: "wand_of_fire",
        name: "Wand of Fire",
        description: "Deal 10 damage to a random enemy. Usable once per combat.",
        type: "usable",
        effect: (_, state) => {
            const alive = state.enemies.filter(e => e.isAlive);
            if (alive.length > 0) {
                const randomTarget = alive[Math.floor(Math.random() * alive.length)];
                randomTarget.takeDamage(10);
                console.log("Wand of Fire hits:", randomTarget.name);
            }
        }
    })
};

const MagicItemLibrary = {
    magicItems,

    getRandom() {
        const keys = Object.keys(magicItems);
        const key = keys[Math.floor(Math.random() * keys.length)];
        return magicItems[key]();
    },

    getRandomMagicItems(amount = 1) {
        const keys = Object.keys(magicItems);
        const shuffled = [...keys].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, amount).map(k => magicItems[k]());
    }
};

export default MagicItemLibrary;
