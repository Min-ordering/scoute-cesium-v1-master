export default class MapStore {
    constructor() {
        this.projects = {};
        this.annotations = {};
    }

    setProjects(projects) {
        this.projects = projects;
    }
}

export class Project {
    constructor() {
        this.id = '';
        this.city = '';
        this.name = '';
        this.assets = {};
    }
}

export class Asset {
    constructor() {
        this.id = '';
        this.name = '';
        this.type = '';
        this.entity = {};
        this.created = '';
    }
}

export class Annotation {
    constructor() {
        this.id = '';
        this.name = '';
        this.type = 'marker';
        this.color = "red";
        this.entity = {};
        this.conversations = [];
    }
}

export class Conversation {
    constructor() {
        this.author = 'John Doe';
        this.content = 'This is marker';
        this.created = '';
    }
}
