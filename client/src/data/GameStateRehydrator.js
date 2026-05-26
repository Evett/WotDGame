import CardFactory from './CardFactory.js';
import CharacterFactory from './CharacterFactory.js';
import Enemy from './Enemy.js';

export default class GameStateRehydrator {

    static serialize(gameState) {
        return {
            health: gameState.health,
            maxHealth: gameState.maxHealth,
            maxActions: gameState.maxActions,
            actions: gameState.actions,
            maxMana: gameState.maxMana,
            mana: gameState.mana,
            gold: gameState.gold,
            armor: gameState.armor,
            nextAttackBonus: gameState.nextAttackBonus,
            handLimit: gameState.handLimit,
            currentNode: gameState.currentNode,
            characterClass: gameState.characterClass,
            level: gameState.level || 1,
            heroAbilityLevel: gameState.heroAbilityLevel || 1,

            character: gameState.character
                ? CharacterFactory.serializeCharacter(gameState.character)
                : null,
            fullDeck: CardFactory.serializeCards(gameState.fullDeck),
            drawPile: CardFactory.serializeCards(gameState.drawPile),
            hand: CardFactory.serializeCards(gameState.hand),
            discardPile: CardFactory.serializeCards(gameState.discardPile),
            removedUntilRest: CardFactory.serializeCards(gameState.removedUntilRest),

            enemies: (gameState.enemies || []).map(e =>
                e instanceof Enemy ? e.serialize() : e
            ),

            magicItems: (gameState.magicItems || []).map(item => ({
                id: item.id,
                name: item.name,
                description: item.description,
                type: item.type,
                isUsed: item.isUsed
            })),

            buffs: gameState.buffs || {},
            statuses: gameState.statuses || {},
            hasEidolon: gameState.hasEidolon || false
        };
    }

    static rehydrate(serialized) {
        if (!serialized) return null;

        // Import GameState lazily to avoid circular dependency
        const rehydrated = { ...serialized };

        if (serialized.character) {
            rehydrated.character = CharacterFactory.rehydrateCharacter(serialized.character);
        }

        rehydrated.fullDeck = CardFactory.rehydrateCards(serialized.fullDeck);
        rehydrated.drawPile = CardFactory.rehydrateCards(serialized.drawPile);
        rehydrated.hand = CardFactory.rehydrateCards(serialized.hand);
        rehydrated.discardPile = CardFactory.rehydrateCards(serialized.discardPile);
        rehydrated.removedUntilRest = CardFactory.rehydrateCards(serialized.removedUntilRest);

        rehydrated.enemies = (serialized.enemies || []).map(e => Enemy.rehydrate(e));

        // Magic items: restore from library by id (functions can't serialize)
        // For now keep as plain data; full rehydration would need MagicItemLibrary lookup
        rehydrated.magicItems = serialized.magicItems || [];

        return rehydrated;
    }
}
