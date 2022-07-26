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

        actorData.hasSpecies = (this.items.filter(i => i.type === "species").length > 0);
        actorData.hasPath = (this.items.filter(i => i.type === "heropath").length > 0);

    }

    async doRoll(dataset) {
        const dlgContent = await renderTemplate("systems/ezd6/templates/dialogs/rolls.hbs", dataset);
        let title = game.i18n.localize("EZD6.Roll");
        let targetNum = 3;
        let target = null;
        let actionText = "";

        switch (dataset.rolltype) {
            case 'armor':
                title = game.i18n.localize("EZD6.WoundSave");
                actionText = game.i18n.localize("EZD6.WoundSave") + " " + game.i18n.localize("EZD6.for") + " " + this.name;
                targetNum = this.data.data.armorsave;
                break;
            case 'tohit':
                title = game.i18n.localize("EZD6.ToHitRoll");
                targetNum = this.data.data.tohit;
                if (game.user.targets.size > 0) {
                    target = Array.from(game.user.targets)[0];
                }
                actionText = this.name + " " + game.i18n.localize("EZD6.attacks") + " " + (target ? target.name : "");
                break;
            case 'miraculous':
                title = game.i18n.localize("EZD6.MiraculousSave");
                actionText = game.i18n.localize("EZD6.MiraculousSave") + " " + game.i18n.localize("EZD6.for") + " " + this.name;
                targetNum = this.data.data.miraculoussave;
                break;
        }

/* put next & success/fail back in, but only for saves! */

        const dlg = new Dialog({
            title: title,
            content: dlgContent,
            buttons:{
                roll: {
                    icon: "<i class='fas fa-dice-d6'></i>",
                    label: game.i18n.localize("EZD6.Roll"),
                    callback: (html) => rollCallback(html)
                },
                cancel: {
                    icon: "<i class='fas fa-times'></i>",
                    label: game.i18n.localize("EZD6.Cancel")
                }
            },
            default: "roll",
        },
        {
            id: "roll-dialog"
        }
        );

        dlg.render(true);


        async function rollCallback(html) {
            let numDice = 1;
            let modifier = "";
            let rollText = "1 " + game.i18n.localize("EZD6.Die");
            let boon = html.find('[name="boonbane"]')[0].value.trim();

            if (boon != "") {
                boon = Number.parseInt(boon);
                numDice += Math.abs(boon);

                if (boon < 0) {
                    rollText = numDice + " " + game.i18n.localize("EZD6.Dice") + " " + game.i18n.localize("EZD6.with") + " " + game.i18n.localize("EZD6.Bane"); 
                    modifier = "kl";
                }
                else if (boon > 0) {
                    rollText = numDice + " " + game.i18n.localize("EZD6.Dice") + " " + game.i18n.localize("EZD6.with") + " " + game.i18n.localize("EZD6.Boon"); 
                    modifier = "kh";
                }
            }

            const formula = numDice + "d6" + modifier;
            const diceRoll = await new Roll(formula).evaluate({ async: true });
            let rollHTML = await diceRoll.render();
            rollHTML = rollHTML.replace(formula, rollText);

            const rollData = {
                rollType: actionText,
                rollHTML: rollHTML
            };
            
            let cardContent = await renderTemplate("systems/ezd6/templates/chatcards/normalroll.hbs", rollData);


            const chatOptions = {
                type: CONST.CHAT_MESSAGE_TYPES.ROLL,
                roll: diceRoll,
                content: cardContent,
                speaker: ChatMessage.getSpeaker({ actor: this })
            }

            ChatMessage.create(chatOptions);
        }
    };

    async rollHeroDie(dataset) {
        const title = this.name + " " + game.i18n.localize("EZD6.RollsAHeroDie") + "!";
        const diceRoll = await new Roll("1d6").evaluate({ async: true });
        const rollHTML = await diceRoll.render();

        const rollData = {
            rollType: title,
            rollHTML: rollHTML,
        };

        let cardContent = await renderTemplate("systems/ezd6/templates/chatcards/herodieroll.hbs", rollData);
        
        const chatOptions = {
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll: diceRoll,
            content: cardContent,
            speaker: ChatMessage.getSpeaker({ actor: this })
        }

        ChatMessage.create(chatOptions);

        await this.update({"data.herodice": --this.data.data.herodice});

    }

    async rollCast(dataset) {
        const dlgContent = await renderTemplate("systems/ezd6/templates/dialogs/cast.hbs", dataset);
        let title = game.i18n.localize("EZD6.Roll");
        let actionText = "";

        switch (dataset.rolltype) {
            case 'cast':
                title = game.i18n.localize("EZD6.RollCast");
                actionText = this.name + " " + game.i18n.localize("EZD6.castsaspell");
                break;
            case 'miracle':
                title = game.i18n.localize("EZD6.RollMiracle");
                actionText = this.name + " " + game.i18n.localize("EZD6.praysforamiracle");
                break;
        }

        const dlg = new Dialog({
            title: title,
            content: dlgContent,
            buttons:{
                roll: {
                    icon: "<i class='fas fa-dice-d6'></i>",
                    label: game.i18n.localize("EZD6.Roll"),
                    callback: (html) => rollCallback(html)
                },
                cancel: {
                    icon: "<i class='fas fa-times'></i>",
                    label: game.i18n.localize("EZD6.Cancel")
                }
            },
            default: "roll",
        },
        {
            id: "roll-dialog"
        }
        );

        dlg.render(true);

    }
}