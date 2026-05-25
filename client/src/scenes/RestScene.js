import BaseScene from './BaseScene';

export class RestScene extends BaseScene {
  constructor() {
    super({ key: 'RestScene' });
  }

  create(data) {
    super.create();
    this.service = data.service;
    this.createBackground(0x1a1a0e);
    this.createInventoryButton(this.service);
    this.choiceMade = false;
    this.gameState = this.service.getMyGameState();

    const { x, y } = this.getCenter();

    this.add.text(x, y - 280, '🔥 Rest Site', {
      fontSize: '34px', color: '#ffaa44', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(x, y - 230, 'Your daily cards have been restored.', {
      fontSize: '15px', color: '#88cc88'
    }).setOrigin(0.5);

    // Restore daily (once-per-rest) cards immediately
    this.gameState.restoreDailyCards();
    this.service.saveMyGameState(this.gameState);

    // Show current stats
    this.add.text(x, y - 190, `HP: ${this.gameState.health}/${this.gameState.maxHealth}  |  Level: ${this.gameState.level}`, {
      fontSize: '16px', color: '#aaa'
    }).setOrigin(0.5);

    // ─── Option 1: Heal ─────────────────────────────────
    const healAmount = Math.floor(this.gameState.maxHealth * 0.5);

    const healBtn = this.add.text(x, y - 100, `❤️ Rest & Heal (+${healAmount} HP)`, {
      fontSize: '22px', backgroundColor: '#2a1a0a',
      padding: { x: 24, y: 14 }, color: '#ff8888'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    healBtn.on('pointerover', () => healBtn.setStyle({ backgroundColor: '#3a2a1a' }));
    healBtn.on('pointerout', () => healBtn.setStyle({ backgroundColor: '#2a1a0a' }));
    healBtn.on('pointerdown', () => this.chooseHeal(healAmount));

    // ─── Option 2: Level Up ─────────────────────────────
    const nextLevel = this.gameState.level + 1;
    const hpGain = 5 + Math.floor(nextLevel * 2);
    const abilityLevel = (this.gameState.heroAbilityLevel || 1) + 1;

    // Get ability description for next level
    let abilityDesc = '';
    if (this.gameState.character && this.gameState.character.heroAbilityDescription) {
      abilityDesc = this.gameState.character.heroAbilityDescription(abilityLevel);
    }
    const abilityName = this.gameState.character?.heroAbilityName || 'Ability';

    const levelBtn = this.add.text(x, y + 0, `⬆️ Level Up (Lv${nextLevel}, +${hpGain} max HP)`, {
      fontSize: '22px', backgroundColor: '#0a1a2a',
      padding: { x: 24, y: 14 }, color: '#88ccff'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    levelBtn.on('pointerover', () => levelBtn.setStyle({ backgroundColor: '#1a2a3a' }));
    levelBtn.on('pointerout', () => levelBtn.setStyle({ backgroundColor: '#0a1a2a' }));
    levelBtn.on('pointerdown', () => this.chooseLevelUp());

    // Show ability upgrade preview
    this.add.text(x, y + 55, `${abilityName}: ${abilityDesc}`, {
      fontSize: '14px', color: '#aaccff'
    }).setOrigin(0.5);

    this.healBtn = healBtn;
    this.levelBtn = levelBtn;

    // Waiting text
    this.waitingText = this.add.text(x, y + 180, '', {
      fontSize: '16px', color: '#888'
    }).setOrigin(0.5);

    // Poll for all players done
    this.time.addEvent({
      delay: 500, loop: true,
      callback: () => this.checkAllDone()
    });

    this.createSceneListener(this.service);
  }

  // ─── Heal Choice ────────────────────────────────────────

  chooseHeal(healAmount) {
    if (this.choiceMade) return;
    this.choiceMade = true;

    const { x, y } = this.getCenter();

    this.healBtn.setVisible(false);
    this.levelBtn.setVisible(false);

    this.gameState.playerHeal(healAmount);
    this.service.saveMyGameState(this.gameState);

    this.add.text(x, y - 40, `Healed ${healAmount} HP!`, {
      fontSize: '22px', color: '#44ff44'
    }).setOrigin(0.5);

    this.add.text(x, y + 0, `HP: ${this.gameState.health}/${this.gameState.maxHealth}`, {
      fontSize: '16px', color: '#cccccc'
    }).setOrigin(0.5);

    this.waitingText.setText('Waiting for other players...');
    this.markDone();
  }

  // ─── Level Up Choice ────────────────────────────────────

  chooseLevelUp() {
    if (this.choiceMade) return;
    this.choiceMade = true;

    const { x, y } = this.getCenter();

    this.healBtn.setVisible(false);
    this.levelBtn.setVisible(false);

    this.gameState.levelUp();
    this.service.saveMyGameState(this.gameState);

    const abilityName = this.gameState.character?.heroAbilityName || 'Ability';
    let abilityDesc = '';
    if (this.gameState.character && this.gameState.character.heroAbilityDescription) {
      abilityDesc = this.gameState.character.heroAbilityDescription(this.gameState.heroAbilityLevel);
    }

    this.add.text(x, y - 60, `Leveled Up to ${this.gameState.level}!`, {
      fontSize: '22px', color: '#44aaff'
    }).setOrigin(0.5);

    this.add.text(x, y - 20, `Max HP: ${this.gameState.maxHealth}`, {
      fontSize: '16px', color: '#cccccc'
    }).setOrigin(0.5);

    this.add.text(x, y + 15, `${abilityName}: ${abilityDesc}`, {
      fontSize: '15px', color: '#aaccff'
    }).setOrigin(0.5);

    this.waitingText.setText('Waiting for other players...');
    this.markDone();
  }

  // ─── Done / Transition ──────────────────────────────────

  markDone() {
    const player = this.service.getMyPlayer();
    player.setState('restDone', true);
  }

  checkAllDone() {
    const allPlayers = this.service.getAllPlayers();
    const allDone = allPlayers.length > 0 &&
      allPlayers.every(p => p.getState('restDone') === true);

    if (allDone) {
      allPlayers.forEach(p => p.setState('restDone', false));

      if (this.service.isHost()) {
        this.service.broadcastSceneSwitch('BeginningChoiceScene');
      }
    }
  }
}