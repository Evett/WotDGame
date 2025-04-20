class MagicItem {
    constructor({ name, description, type, effect, isUsed = false, triggers = {} }) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.effect = effect;
        this.triggers = triggers;
        this.isUsed = isUsed;
    }

    use(scene, effect) {
    }
}

export default MagicItem;