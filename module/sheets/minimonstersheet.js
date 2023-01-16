import { EZD6 } from '../config.js';

export class MiniMonsterSheet extends FormApplication {
    constructor(object, options) {
        super(object, options);
        this.actor = object || {};
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: 'systems/ezd6/templates/formapplications/minimonster.hbs',
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

    activateListeners(html) {
        super.activateListeners(html);

        html.find('.open-sheet').click(this._onOpenSheetClick.bind(this));
        html.find('.strikes').click(this._onRemoveStrike.bind(this));
        html.find('.strikes').contextmenu(this._onAddStrike.bind(this));
        html.find('.roll').click(this._onRoll.bind(this));
        html.find('.roll-monster-magic').click(this._onCast.bind(this, {rolltype: "monster-magic"}));
        html.find('.roll-miracle').click(this._onCast.bind(this, {rolltype: "miracle"}));
        html.find('.roll-magic-resist').click(this._onRollResist.bind(this));
    }

    
    _onOpenSheetClick(event) {
        this.actor.sheet.render(true);
     }
 
     _onRemoveStrike(event) {
         this.actor.removeStrike();
     }
 
     _onAddStrike(event) {
         this.actor.addStrike();
     }
 
     async _onRoll(event) {
         event.preventDefault();
         const element = event.currentTarget;
         const dataset = element.dataset;
 
         await this.actor.doRoll(dataset);
     }
  
     _onCast(dataset) {
         this.actor.rollCast(dataset);
     }
 
     _onRollResist(event) {
         this.actor.rollResist();
     }
}