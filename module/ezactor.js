import { EZD6 } from './config.js';

export default class EZActor extends Actor {

    async _preCreate(data, options, userId) {
        await super._preCreate(data, options, userId);

        // assign a default image based on item type
        if (!data.img) {
            const img = EZD6.ActorTypeImages[data.type];
            if (img) await this.data.update({ img });
        }

        // set some token defaults for player characters
        if ( this.type === "character" ) {
            this.data.token.update({vision: true, actorLink: true, disposition: 1});
        }
        else {
            this.data.token.update({vision: false, actorLink: false, disposition: -1});
        }
    }

    prepareDerivedData() {
        super.prepareDerivedData();

        if (this.data.type === 'character') {this._prepareDerivedCharacterData()};
    }

    _prepareDerivedCharacterData() {
        const actorData = this.data.data;

        actorData.hasSpecies = (actorData.species != "");
        actorData.hasPath = (actorData.heropath != "");
    }

    


}