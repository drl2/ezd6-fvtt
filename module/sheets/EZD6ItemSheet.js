import { EZD6 } from "../config.js";

export default class EZD6ItemSheet extends ItemSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["ezd6", "sheet", "item"]
        })
    }

    get template() {
        return `systems/ezd6/templates/sheets/EZD6Item-sheet.hbs`;
    }


    getData(options) {
        const baseData = super.getData();
        const isOwned = (baseData.item.actor !== null)

        let sheetData = {
            owner: this.item.isOwner,
            editable: this.isEditable,
            item: baseData.item,
            data: baseData.item.data.data,
            isowned: isOwned,
            ezd6: EZD6,
            isEquipment: baseData.item.type === "equipment"
        }
        sheetData.itemType = game.i18n.localize(`ITEM.Type${sheetData.item.data.type.titleCase()}`)

        return sheetData;
    }
}