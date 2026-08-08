class MagicItem {
    constructor({ id, name, description, type, effect, isUsed = false, usesPerCombat = 1, currentUses = 0, triggers = {} }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type; // "passive" or "usable"
        this.effect = effect;
        this.isUsed = isUsed;
        this.usesPerCombat = usesPerCombat;
        this.currentUses = currentUses;
        this.triggers = triggers;
    }

    /**
     * Use an active/usable item. Returns true if successfully used.
     */
    use(target, state, scene) {
        if (this.type !== 'usable') {
            console.log("Cannot use passive item:", this.name);
            return false;
        }
        if (this.currentUses >= this.usesPerCombat) {
            console.log("Item already used max times this combat:", this.name);
            return false;
        }
        if (this.effect) {
            this.effect(target, state, scene);
            this.currentUses++;
            this.isUsed = this.currentUses >= this.usesPerCombat;
            console.log("Used magic item:", this.name, `(${this.currentUses}/${this.usesPerCombat})`);
            return true;
        }
        return false;
    }

    canUse() {
        return this.type === 'usable' && this.currentUses < this.usesPerCombat;
    }

    resetForCombat() {
        this.isUsed = false;
        this.currentUses = 0;
    }
}

export default MagicItem;
