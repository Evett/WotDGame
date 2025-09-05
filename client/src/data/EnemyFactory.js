import EnemyLibrary from './EnemyLibrary.js';
import Enemy from './Enemy.js';

export default class EnemyFactory {

  static create(key, scene, overrides = {}) {
    const creator = EnemyLibrary[key];
    if (!creator) {
      console.warn(`Unknown enemy key: ${key}, using generic Enemy.`);
      return new Enemy(scene, { name: key, maxHealth: 10, ...overrides });
    }
    const enemy = creator(scene);
    Object.assign(enemy, overrides); // apply overrides like currentHP, buffs, etc.
    enemy.key = key;
    return enemy;
  }

  static rehydrate(scene, plainEnemies) {
    if (!plainEnemies) return [];
    return plainEnemies.map(e => EnemyFactory.create(e.key, scene, e));
  }

  static serialize(enemies) {
    return enemies.map(e => ({
      key: e.key || e.name,
      name: e.name,
      currentHP: e.currentHP,
      maxHealth: e.maxHealth,
      intents: e.intents,
      buffs: e.buffs || []
    }));
  }
}
