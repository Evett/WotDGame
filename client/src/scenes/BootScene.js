import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // ─── Music tracks ────────────────────────────────────
        // Place your .mp3 or .ogg files in client/public/audio/
        // The keys below are placeholders — they will silently fail
        // to load until you drop real files in the audio folder.

        this.load.audio('bgm_menu', 'audio/bgm_menu.mp3');
        this.load.audio('bgm_explore', 'audio/bgm_explore.mp3');
        this.load.audio('bgm_battle', 'audio/bgm_battle.mp3');
        this.load.audio('bgm_boss', 'audio/bgm_boss.mp3');
        this.load.audio('bgm_victory', 'audio/bgm_victory.mp3');
        this.load.audio('bgm_gameover', 'audio/bgm_gameover.mp3');

        // Suppress errors for missing placeholder files
        this.load.on('loaderror', (file) => {
            console.warn(`[BootScene] Audio not found (placeholder): ${file.key}`);
        });
    }

    create() {
        this.scene.start('StartingScene');
    }
}
