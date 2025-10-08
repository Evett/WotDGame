import Card from "./Card";

export default class CardFactory {

  static rehydrateCards(arr) {
    if (!arr) return [];
    return arr.map(c => c instanceof Card ? c : new Card(c));
  }

  static serializeCards(arr) {
    if (!arr) return [];
    return arr.map(c => ({
      name: c.name,
      actionCost: c.actionCost,
      manaCost: c.manaCost,
      type: c.type,
      requiresTarget: c.requiresTarget,
      isOncePerDay: c.isOncePerDay,
      description: c.description,
      upgradedDescription: c.upgradedDescription,
      effect: c.effect,
      upgraded: c.upgraded
    }));
  }
}