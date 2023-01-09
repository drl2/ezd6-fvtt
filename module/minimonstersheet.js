import { EZD6 } from './config.js';

export class MiniMonsterSheet extends FormApplication {
    constructor(object, options) {
        super(object, options);
        this.actor = object || {};
    }


    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: 'systems/ezd6/templates/formapplications/minimonster.hbs',
            closeOnSubmit: false,
            width: "auto",
            height: "auto",
            resizable: false,
            classes: ["ezd6", "sheet", "mini"]
        })
    }

    get id() {
        let id = `ezd6-mini-sheet-${this.actor.id}`;
        if (this.actor.isToken) id += `-${this.actor.token.id}`;
        return id
    }

    get title() {
        return this.actor.name;
    }

    getData(options) {
        const data = super.getData(options);
        return data;
    }
}