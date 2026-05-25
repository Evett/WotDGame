class Event {
    constructor({ title, description, tags, choices }) {
        this.title = title;
        this.description = description;
        this.tags = tags || [];
        this.choices = choices; // Array of { text, effect(gameState) }
    }

    serialize() {
        return {
            title: this.title,
            description: this.description,
            tags: this.tags,
            choices: this.choices.map(c => ({ text: c.text }))
        };
    }
}

export default Event;
