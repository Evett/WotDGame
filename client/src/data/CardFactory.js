import Card from './Card.js';
import CardLibrary from './CardLibrary.js';

export default class CardFactory {

    static rehydrateCard(data) {
        if (data instanceof Card) return data;

        // Look up the card definition by name to restore the effect function
        for (const classCards of Object.values(CardLibrary.cards)) {
            for (const [key, factory] of Object.entries(classCards)) {
                const template = factory();
                if (template.name === data.name) {
                    const card = new Card({
                        ...data,
                        effect: template.effect
                    });
                    return card;
                }
            }
        }

        // Fallback: create card without effect (shouldn't happen if library is complete)
        console.warn(`Could not find effect for card: ${data.name}`);
        return new Card(data);
    }

    static rehydrateCards(arr) {
        if (!arr) return [];
        return arr.map(c => CardFactory.rehydrateCard(c));
    }

    static serializeCard(card) {
        return {
            name: card.name,
            actionCost: card.actionCost,
            manaCost: card.manaCost,
            type: card.type,
            requiresTarget: card.requiresTarget,
            isOncePerDay: card.isOncePerDay,
            description: card.description,
            upgradedDescription: card.upgradedDescription,
            upgraded: card.upgraded
        };
    }

    static serializeCards(arr) {
        if (!arr) return [];
        return arr.map(c => CardFactory.serializeCard(c));
    }
}
