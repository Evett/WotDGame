import BaseScene from './BaseScene';
import EventLibrary from '../data/EventLibrary';

export class EventScene extends BaseScene {
  constructor() {
    super({ key: 'EventScene' });
  }

  create(data) {
    super.create();
    this.service = data.service;
    this.createBackground(0x0e1a0e);
    this.createInventoryButton(this.service);
    this.voted = false;
    this.resolved = false;
    this.gameState = this.service.getMyGameState();

    const { x, y } = this.getCenter();

    this.add.text(x, y - 280, '⚡ Event', {
      fontSize: '32px', color: '#ffcc44', fontStyle: 'bold'
    }).setOrigin(0.5);

    // Host picks a random event and stores it in room state
    if (this.service.isHost()) {
      const event = EventLibrary.getRandom();
      const serialized = {
        title: event.title,
        description: event.description,
        choices: event.choices.map(c => c.text)
      };
      this.service.setRoomState('currentEvent', serialized);
      this.service.setRoomState('eventVotes', {});
      this.currentEvent = event;
      this.displayEvent(serialized);
    } else {
      // Non-host waits for event data
      this.waitingText = this.add.text(x, y, 'Waiting for event...', {
        fontSize: '18px', color: '#888'
      }).setOrigin(0.5);

      this.time.addEvent({
        delay: 200, loop: true,
        callback: () => {
          const eventData = this.service.getRoomState('currentEvent');
          if (eventData && !this.eventDisplayed) {
            this.eventDisplayed = true;
            if (this.waitingText) this.waitingText.destroy();
            this.currentEvent = this.findEventByTitle(eventData.title);
            this.displayEvent(eventData);
          }
        }
      });
    }

    // Poll for vote resolution
    this.time.addEvent({
      delay: 500, loop: true,
      callback: () => this.checkVotes()
    });

    this.createSceneListener(this.service);
  }

  // ─── Display Event ──────────────────────────────────────

  displayEvent(eventData) {
    const { x, y } = this.getCenter();

    this.add.text(x, y - 220, eventData.title, {
      fontSize: '26px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(x, y - 170, eventData.description, {
      fontSize: '16px', color: '#cccccc',
      wordWrap: { width: 600 }, align: 'center'
    }).setOrigin(0.5);

    // Display choices as vote buttons
    this.choiceButtons = [];
    const startY = y - 80;
    const spacing = 60;

    eventData.choices.forEach((choiceText, index) => {
      const btn = this.add.text(x, startY + index * spacing, choiceText, {
        fontSize: '18px', backgroundColor: '#1a3a2a',
        padding: { x: 20, y: 10 }, color: '#88ff88'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => {
        if (!this.voted) btn.setStyle({ backgroundColor: '#2a5a3a' });
      });
      btn.on('pointerout', () => {
        if (!this.voted) btn.setStyle({ backgroundColor: '#1a3a2a' });
      });
      btn.on('pointerdown', () => this.castVote(index));

      this.choiceButtons.push(btn);
    });

    // Vote status text
    this.voteStatusText = this.add.text(x, y + 200, '', {
      fontSize: '14px', color: '#888'
    }).setOrigin(0.5);
  }

  // ─── Voting ─────────────────────────────────────────────

  castVote(choiceIndex) {
    if (this.voted) return;
    this.voted = true;

    const player = this.service.getMyPlayer();
    const votes = this.service.getRoomState('eventVotes') || {};
    votes[player.id] = choiceIndex;
    this.service.setRoomState('eventVotes', votes);

    // Highlight selected, dim others
    this.choiceButtons.forEach((btn, i) => {
      if (i === choiceIndex) {
        btn.setStyle({ backgroundColor: '#2a6a3a', color: '#ffffff' });
      } else {
        btn.setStyle({ backgroundColor: '#111', color: '#555' });
        btn.disableInteractive();
      }
    });

    this.voteStatusText.setText('Vote cast! Waiting for others...');
  }

  // ─── Check Votes ────────────────────────────────────────

  checkVotes() {
    if (this.resolved) return;

    const votes = this.service.getRoomState('eventVotes') || {};
    const totalPlayers = this.service.getAllPlayers().length;
    const voteCount = Object.keys(votes).length;

    // Update status
    if (this.voteStatusText && this.voted) {
      this.voteStatusText.setText(`Votes: ${voteCount}/${totalPlayers}`);
    }

    if (voteCount < totalPlayers) return;

    // All voted — tally
    this.resolved = true;
    this.resolveVotes(votes);
  }

  resolveVotes(votes) {
    const { x, y } = this.getCenter();

    // Count votes per choice
    const tally = {};
    Object.values(votes).forEach(choiceIdx => {
      tally[choiceIdx] = (tally[choiceIdx] || 0) + 1;
    });

    const maxVotes = Math.max(...Object.values(tally));
    const topChoices = Object.keys(tally).filter(k => tally[k] === maxVotes).map(Number);

    // Break ties randomly
    const winningIndex = topChoices.length === 1
      ? topChoices[0]
      : topChoices[Math.floor(Math.random() * topChoices.length)];

    // Highlight winner
    if (this.choiceButtons) {
      this.choiceButtons.forEach((btn, i) => {
        if (i === winningIndex) {
          btn.setStyle({ backgroundColor: '#44aa44', color: '#ffffff' });
        } else {
          btn.setStyle({ backgroundColor: '#111', color: '#444' });
        }
      });
    }

    // Apply effect to this player's gameState
    if (this.currentEvent && this.currentEvent.choices[winningIndex]) {
      const effect = this.currentEvent.choices[winningIndex].effect;
      if (effect) {
        effect(this.gameState);
        this.service.saveMyGameState(this.gameState);
      }
    }

    // Show result
    const winText = this.currentEvent
      ? this.currentEvent.choices[winningIndex].text
      : `Choice ${winningIndex + 1}`;

    if (this.voteStatusText) this.voteStatusText.destroy();

    this.add.text(x, y + 200, `✓ Outcome: ${winText}`, {
      fontSize: '16px', color: '#44ff44', fontStyle: 'bold'
    }).setOrigin(0.5);

    // Mark done and wait for all, then go back to choices
    this.markDone();
  }

  // ─── Done / Transition ──────────────────────────────────

  markDone() {
    const player = this.service.getMyPlayer();
    const doneMap = this.service.getRoomState('eventDone') || {};
    doneMap[player.id] = true;
    this.service.setRoomState('eventDone', doneMap);

    this.time.addEvent({
      delay: 500, loop: true,
      callback: () => this.checkAllDone()
    });
  }

  checkAllDone() {
    if (this.transitioned) return;
    const allPlayers = this.service.getAllPlayers();
    if (allPlayers.length === 0) return;

    const doneMap = this.service.getRoomState('eventDone') || {};
    const allDone = allPlayers.every(p => doneMap[p.id] === true);

    if (allDone) {
      this.transitioned = true;
      this.service.setRoomState('eventDone', null);
      this.service.setRoomState('currentEvent', null);
      this.service.setRoomState('eventVotes', null);
      this.service.broadcastSceneSwitch('NarrativeScene');
    }
  }

  // ─── Helpers ────────────────────────────────────────────

  findEventByTitle(title) {
    return Object.values(EventLibrary.events).find(e => e.title === title) || null;
  }
}