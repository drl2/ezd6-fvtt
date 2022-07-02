import { EZD6 } from "../config.js";

export default class EZD6CharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["ezd6", "sheet", "character"],
            tabs: [{ navSelector: ".sheet-navigation", contentSelector: ".sheet-body", initial: "stats" }]
        });
    }

    get template() {
        if (this.actor.data.type === 'monster') {
            return `systems/ezd6/templates/sheets/monster-sheet.hbs`;
        }
        else {
            return `systems/ezd6/templates/sheets/EZD6Character-sheet.hbs`;
        }
    }

}