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
        let targetNum = 0;
        let target = null;
        let actionText = "";

        switch (dataset.rolltype) {
            case 'wound':
                title = game.i18n.localize("EZD6.WoundSave");
                actionText = game.i18n.localize("EZD6.WoundSave") + " " + game.i18n.localize("EZD6.for") + " " + this.name;
                targetNum = this.data.data.armorsave;
                break;
            case 'attack':
                title = game.i18n.localize("EZD6.ToHitRoll");
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
            case 'task':
                title = game.i18n.localize("EZD6.RollTaskCheck");
                actionText = this.name + " " + game.i18n.localize("EZD6.RollsTaskCheck") 
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


        async function rollCallback(html) {
            let numDice = 1;
            let modifier = "";
            let rollText = "1d6";
            let boon = html.find('[name="boonbane"]')[0].value.trim();
            let needs = "";
            let rollResults = "";

            if (boon != "") {
                boon = Number.parseInt(boon);
                numDice += Math.abs(boon);

                if (boon < 0) {
                    rollText = numDice + "d6 " + game.i18n.localize("EZD6.with") + " " + game.i18n.localize("EZD6.Bane"); 
                    modifier = "kl";
                }
                else if (boon > 0) {
                    rollText = numDice + "d6 " + game.i18n.localize("EZD6.with") + " " + game.i18n.localize("EZD6.Boon"); 
                    modifier = "kh";
                }
            }

            const formula = numDice + "d6" + modifier;
            const diceRoll = await new Roll(formula).evaluate({ async: true });
            let rollHTML = await diceRoll.render();
            rollHTML = rollHTML.replace(formula, rollText);

            
            if (targetNum) {  // for saves, show needs & results
                needs = game.i18n.localize("EZD6.Needs") + " " + targetNum + "+";
                rollResults = ((diceRoll.total >= targetNum) ? game.i18n.localize("EZD6.Success") : game.i18n.localize("EZD6.RollFailed")) + "!"
            }

            const rollData = {
                rollType: actionText,
                rollHTML: rollHTML,
                needs: needs,
                rollResults: rollResults
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
        if (this.data.data.herodice === 0) {
            ui.notifications.info(game.i18n.localize("MESSAGES.NoHeroDice"));
        }
        else {
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
    }

    async rollCast(dataset) {
        const dlgContent = await renderTemplate("systems/ezd6/templates/dialogs/cast.hbs", dataset);
        let title = game.i18n.localize("EZD6.Roll");
        let actionText = "";

        switch (dataset.rolltype) {
            case 'spell':
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


        async function rollCallback(html) {
            const numDice = html.find('[name="numdice"]')[0].value.trim();
            const formula = numDice + "d6kh";

            const diceRoll = await new Roll(formula).evaluate({ async: true });
            let rollHTML = await diceRoll.render();

            const rollResults = ((diceRoll.dice[0].results.filter(r => {return r.result === 1}).length > 0) ? game.i18n.localize("EZD6.RollFailed") : game.i18n.localize("EZD6.Success")) + "!";

            rollHTML = rollHTML.replace("dice-tooltip", "dice-tooltip expanded");
            rollHTML = rollHTML.replace(formula, formula.replace("kh", ", " + game.i18n.localize("EZD6.KeepHighest")));

            const rollData = {
                rollType: actionText,
                rollHTML: rollHTML,
                rollResults: rollResults
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

    }
}