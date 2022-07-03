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

    getData(options) {
        const sheetData = super.getData(options);
        const actorData = this.actor.data.toObject(false);
        sheetData.actor = actorData;
        sheetData.data = actorData.data;

        this._prepareItems(sheetData);

        return sheetData;
    }


    _prepareItems(sheetData) {
        const heropath = [];
        const species = [];
        const boon = [];
        const feature = [];
        const inclination = [];
        const aspect = [];
        const circle = [];
        const equipment = [];
        const monsterfeature = [];

        for (let i of sheetData.items) {
            i.img = i.img || DEFAULT_TOKEN;

            if (i.type === 'heropath') {
                heropath.push(i);
            }

            if (i.type === 'species') {
                species.push(i);
            }

            if (i.type === 'boon') {
                boon.push(i);
            }

            if (i.type === 'feature') {
                feature.push(i);
            }

            if (i.type === 'inclination') {
                inclination.push(i);
            }

            if (i.type === 'aspect') {
                aspect.push(i);
            }

            if (i.type === 'circle') {
                circle.push(i);
            }

            if (i.type === 'equipment') {
                equipment.push(i);
            }

            if (i.type === 'monsterfeature') {
                monsterfeature.push(i);
            }

            sheetData.heropath = heropath;
            sheetData.species = species;
            sheetData.boon = boon;
            sheetData.feature = feature;
            sheetData.inclination = inclination;
            sheetData.aspect = aspect;
            sheetData.circle = circle;
            sheetData.equipment = equipment;
            sheetData.monsterfeature = monsterfeature;
        }
    }
}