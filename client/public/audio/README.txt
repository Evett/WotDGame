Done. Here's the setup:

Where to put music files:
client/public/audio/
├── bgm_menu.mp3       ← lobby/title screen
├── bgm_explore.mp3    ← narrative/exploration between battles
├── bgm_battle.mp3     ← normal combat
├── bgm_boss.mp3       ← boss & final boss fights
├── bgm_victory.mp3    ← victory screen
└── bgm_gameover.mp3   ← game over screen
Use .mp3 format for best browser compatibility. .ogg also works if you update the file extensions in BootScene.js.

How it works:

BootScene.js runs first and preloads all audio keys. Missing files log a warning but don't crash.
BaseScene.js has playMusic(key) and stopMusic() — any scene can call these. It auto-stops the previous track before playing a new one, and won't duplicate if the same track is already playing.
Each scene calls this.playMusic('bgm_...') in its create() method, so music transitions happen automatically on scene changes.