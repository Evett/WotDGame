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
        if(this.effect && !this.used) {
            this.effect(target, state, scene);
            this.isUsed = true;
            return;
        }
        console.log("Item already used this combat:", this);
    }
}

export default MagicItem;