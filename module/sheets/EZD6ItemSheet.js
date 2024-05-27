import { EZD6 } from "../config.js";

export default class EZD6ItemSheet extends ItemSheet {

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["ezd6", "sheet", "item"]
        })
    }

    get template() {
        return `systems/ezd6/templates/sheets/EZD6Item-sheet.hbs`;
    }

    

    async getData(options) {
        const baseData = await super.getData();
        const isOwned = (baseData.item.actor !== null)

        let sheetData = {
            owner: this.item.isOwner,
            editable: this.isEditable,
            item: baseData.item,
            system: baseData.item.system,
            isowned: isOwned,
            ezd6: EZD6,
            isEquipment: baseData.item.type === "equipment",
            isBoon: baseData.item.type === "boon"
        }
        sheetData.itemType = game.i18n.localize(`ITEM.Type${sheetData.item.type.titleCase()}`)
        sheetData.enrichedDescription = await TextEditor.enrichHTML(baseData.item.system.description);

        return sheetData;
    }

}