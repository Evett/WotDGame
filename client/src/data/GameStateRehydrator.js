import CardFactory from './CardFactory.js';
import CharacterFactory from './CharacterFactory.js';
import EnemyFactory from './EnemyFactory.js';


export default class GameStateRehydrator {

  static rehydrate(serverState) {
    if (!serverState) return {};

    const rehydrated = { ...serverState };

    if (serverState.fullDeck) {
      rehydrated.fullDeck = CardFactory.rehydrateCards(serverState.fullDeck);
    }

    if (serverState.hand) {
      rehydrated.hand = CardFactory.rehydrateCards(serverState.hand);
    }

    if (serverState.discardPile) {
      rehydrated.discardPile = CardFactory.rehydrateCards(serverState.discardPile);
    }

    if (serverState.removedUntilRest) {
      rehydrated.removedUntilRest = CardFactory.rehydrateCards(serverState.removedUntilRest);
    }

    if (serverState.drawPile) {
        rehydrated.drawPile = CardFactory.rehydrateCards(serverState.drawPile);
    }

    if (serverState.character) {
      rehydrated.character = CharacterFactory.rehydrateCharacter(serverState.character);
    }

    if (serverState.enemies) {
      rehydrated.enemies = EnemyFactory.rehydrate(this, serverState.enemies);
    }

    return rehydrated;
  }
}
