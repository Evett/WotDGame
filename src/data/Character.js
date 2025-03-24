class Character {
    constructor(name, health, actions, deck, heroAbility) {
        this.name = name;
        this.health = health;
        this.actions = actions;
        this.deck = deck;
        this.heroAbility = heroAbility;
    }
}

const characters = {
    alaen: new Character(
        "Alaen",
        120,
        3,
        ["Strike", "Block", "Berserk"],
        (gameState) => {
            console.log("Alaen's Rage: Gain +1 Action!");
            gameState.actions += 1;
        }
    ),
    hassan: new Character(
        "Hassan",
        90,
        4,
        ["Quick Strike", "Evasion", "Backstab"],
        (gameState) => {
            console.log("Hassan's Shadow Step: Gain temporary Evasion!");
        }
    ),
    marcus: new Character(
        "Marcus",
        80,
        3,
        ["Fireball", "Arcane Shield", "Mana Surge"],
        (gameState) => {
            console.log("Marcus's Arcane Boost: Restore 1 action!");
            gameState.actions += 1;
        }
    ),
    mohef: new Character(
        "Mohef",
        100,
        4,
        ["Arrow Shot", "Dodge", "Multi-Shot"],
        (gameState) => {
            console.log("Mohef's Precision: Your next attack deals double damage!");
        }
    ),
    nephereta: new Character(
        "Nephereta",
        110,
        3,
        ["Holy Strike", "Divine Shield", "Smite"],
        (gameState) => {
            console.log("Nephereta's Blessing: Heal 5 HP!");
            gameState.health = Math.min(gameState.health + 5, gameState.maxHealth);
        }
    ),
    urusha: new Character(
        "Urusha",
        85,
        3,
        ["Life Drain", "Dark Pact", "Hellfire"],
        (gameState) => {
            console.log("Urusha's Sacrifice: Lose 5 HP, gain 2 actions.");
            gameState.health -= 5;
            gameState.actions += 2;
        }
    ),
};

export default characters;