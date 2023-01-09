import { EZD6 } from './config.js';

export class MiniCharSheet extends FormApplication {
    constructor(object, options) {
        super(object, options);
        this.actor = object || {};
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: 'systems/ezd6/templates/formapplications/minichar.hbs',
            closeOnSubmit: false,
            width: "290",
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
        data.strikesHtml = this.renderStrikes();
        data.heroDiceHtml = this.renderHeroDice();
        data.karmaHtml = this.renderKarma();
        return data;
    }

    renderStrikes() {
        let html = "";
        const strikes = this.actor.system.strikes.value;

        for (let i=0; i < this.actor.system.strikes.max; i++)
        {
            if (i < strikes) {
                html += '<i class="fas fa-heart strike"></i>'
            }
            else {
                html += '<i class="fas fa-heart used-strike"></i>'
            }
        }
        return html;
    }

    renderHeroDice() {
        let html = "";

        for (let i=0; i < this.actor.system.herodice; i++)
        {
            html += '<i class="fas fa-square hero-die"></i>'
        }
        return html;
    }

    renderKarma() {
        let html = "";

        for (let i=0; i < this.actor.system.karma; i++)
        {
            html += '<i class="fas fa-circle karma"></i>'
        }
        return html;
    }

}