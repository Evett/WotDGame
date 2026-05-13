class MagicItem {
    constructor({ id, name, description, type, effect, isUsed = false, triggers = {} }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.effect = effect;
        this.isUsed = isUsed;
        this.triggers = triggers;
    }

    use(target, state, scene) {
        if (this.effect && !this.isUsed) {
            this.effect(target, state, scene);
            this.isUsed = true;
            console.log("Used magic item:", this.name);
            return true;
        }
        console.log("Item already used this combat:", this.name);
        return false;
    }

    resetForCombat() {
        this.isUsed = false;
    }
}

export default MagicItem;
