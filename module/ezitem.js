import { EZD6 } from './config.js';


/**
 * Override and extend the basic Item implementation.
 * @extends {Item}
 */
export default class EZItem extends Item {

    /**
     * Extends Item._preCreate to add default images by item type
     * @param {*} data 
     * @param {*} options 
     * @param {*} userId 
     */
     async _preCreate(data, options, userId) {
        await super._preCreate(data, options, userId);

        // assign a default image based on item type
        if (!data.img) {
            const img = EZD6.ItemTypeImages[data.type];
            if (img) await this.updateSource({ img: img });
        }
    }

    async _preUpdate(changed, options, userId) {
        await super._preUpdate(changed, options, userId);

        if (foundry.utils.hasProperty(changed.system, "equipmenttype")) {
            const splitArray = changed.system["equipmenttype"].toLowerCase().split(".");

            const img = EZD6.EquipmentTypeImages[splitArray[1]];
            changed.img = img;
        }   
    }

    async addQuantity() {
        let qty = this.system.quantity;
        qty = !qty ? 1 : qty + 1;
        await this.update({"system.quantity": qty});
    }

    async removeQuantity() {
        let qty = this.system.quantity;
        qty = isNaN(qty) ? 0 : qty;
        qty = (qty > 0) ? qty - 1 : 0;
        await this.update({"system.quantity": qty});
    }

}