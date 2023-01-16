import { EZD6 } from './config.js';
import { MiniCharSheet } from './sheets/minicharsheet.js';
import { MiniMonsterSheet } from './sheets/minimonstersheet.js';
import {simpleGMWhisper} from './utility.js';

export default class EZActor extends Actor {

    async _preCreate(data, options, userId) {
        await super._preCreate(data, options, userId);

        // assign a default image based on item type
        if (!data.img) {
            const img = EZD6.ActorTypeImages[data.type];
            if (img) await this.updateSource({ img });
        }

        // set some token defaults for player characters
        if ( this.type === "character" ) {
            this.updateSource(
                {prototypeToken: {
                    vision: true,
                    actorLink: true,
                    disposition: 1
                }}
            )
        }
        else {
            this.updateSource(
                {prototypeToken: {
                    vision: false,
                    actorLink: false,
                    disposition: -1
                }}
            )
        }
    }

    _preUpdate(changed, options, userId) {
        const oldKarma = this.system.karma;
        const oldDice = this.system.herodice;
        super._preUpdate(changed, options, userId);

        if (changed.system.hasOwnProperty('karma')) {
            const showKarmaChange = game.settings.get(game.system.id, "showKarmaChangeInChat");

            if (showKarmaChange !== "never") {
                const newKarma = changed.system.karma;
                const chg = newKarma - oldKarma;
                const speaker = ChatMessage.getSpeaker({actor: this});
                
                const msg = this.name + " " + 
                    (chg > 0 ? game.i18n.localize("EZD6.added") : game.i18n.localize("EZD6.spent"))
                    + " " + Math.abs(chg)
                    + " " + game.i18n.localize("EZD6.Karma") + " (" + game.i18n.localize("EZD6.Total")
                    + ": " + newKarma + ")";

                if (showKarmaChange == "rronly") {
                    simpleGMWhisper(speaker, msg);
                }
                else {  //show everyone
                    const chatOptions = {
                        speaker: speaker,
                        content: msg
                    }
                    ChatMessage.create(chatOptions);
                }
            }
        }    

        if (changed.system.hasOwnProperty('herodice')) {
            const showChangeHeroDice = game.settings.get(game.system.id, "showChangeHeroDice");
            const newDice = changed.system.herodice;
            let chg = newDice - oldDice;
            chg = (chg === 0) ? 1 : chg;

            if (showChangeHeroDice !== "never") {
                
                const speaker = ChatMessage.getSpeaker({actor: this});
                
                const msg = this.name + " " + 
                    (chg > 0 ? game.i18n.localize("EZD6.added") : game.i18n.localize("EZD6.spent"))
                    + " " + Math.abs(chg)
                    + " " + game.i18n.localize("EZD6.HeroDice") + " (" + game.i18n.localize("EZD6.Total")
                    + ": " + newDice + ")";

                if (showChangeHeroDice == "rronly") {
                    simpleGMWhisper(speaker, msg);
                }
                else {  //show everyone
                    const chatOptions = {
                        speaker: speaker,
                        content: msg
                    }
                    ChatMessage.create(chatOptions);
                }
            }
        }    
    }

    _onUpdate(data, options, userId) {
        super._onUpdate(data, options, userId);
        if (('strikes' in data.system) || ('karma' in data.system) || ('herodice' in data.system))
        {
            let id = `ezd6-mini-sheet-${this.id}`;
            if (this.isToken) id += `-${this.token.id}`;
            const mini = Object.values(ui.windows).find(window => window.id === id)
            if (mini) { mini.render(true); }
        }
    }



    prepareDerivedData() {
        super.prepareDerivedData();

        if (this.type === 'character') {this._prepareDerivedCharacterData()};
    }

    _prepareDerivedCharacterData() {
        const actorData = this.system;

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
                targetNum = this.system.armorsave;
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
                targetNum = this.system.miraculoussave;
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
        if (this.type != "character") {
            ui.notifications.warn(game.i18n.localize("MESSAGES.NoHeroDice"));
        }
        else
        if (this.system.herodice === 0) {
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

            await this.update({"system.herodice": --this.system.herodice});
        }
    }

    async rollCast(dataset) {
        let dice = 1;
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
            case 'monster-magic':
                dice = this.system.magicdice;
                title = game.i18n.localize("EZD6.RollMonsterMagic");
                actionText = this.name + " " + game.i18n.localize("EZD6.rollsmonstermagic");
                break;
        }

        dataset.dice = dice;
        const dlgContent = await renderTemplate("systems/ezd6/templates/dialogs/cast.hbs", dataset);

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

    async rollResist() {
        const data = {
            config: EZD6,
            dice: this.system.magicresist
        };

        const dlgContent = await renderTemplate("systems/ezd6/templates/dialogs/resist.hbs", data);
        const title = this.name + " " + game.i18n.localize("EZD6.RollsToResistMagic");
        
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

            rollHTML = rollHTML.replace("dice-tooltip", "dice-tooltip expanded");
            rollHTML = rollHTML.replace(formula, formula.replace("kh", ", " + game.i18n.localize("EZD6.KeepHighest")));

            const rollData = {
                rollType: title,
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

    }


    async buyHeroDie() {
        if (this.system.karma < 5) {
            return ui.notifications.warn(game.i18n.localize("WARNINGS.Need5Karma"));
        }
        else if (this.system.herodice > 0) {
            return ui.notifications.warn(game.i18n.localize("WARNINGS.HasHeroDie"));
        }
        else {
            return await this.update({"system.herodice": 1, "system.karma": this.system.karma-5});
        }
    }

    
    async removeStrike() {
        const actorData = this.system;
        const newVal = actorData.strikes.value > 0 ? actorData.strikes.value -1 : 0;
        if (newVal !== actorData.strikes.value) { await this.update({"system.strikes.value": newVal}); };
    }

    async addStrike() {
        const actorData = this.system;
        const newVal = actorData.strikes.value < actorData.strikes.max ? actorData.strikes.value +1 : actorData.strikes.max;
        if (newVal !== actorData.strikes.value) { await this.update({"system.strikes.value": newVal}); };
    }

    async addHeroDie() {
        await this.update({"system.herodice": this.system.herodice + 1});
    }

    async spendKarma() {
        let karma = this.system.karma -1;
        if (karma < 0) { karma = 0; }
        await this.update({"system.karma": karma});
    }

    async addKarma() {
        await this.update({"system.karma": this.system.karma + 1});
    }

    
    async showMini() {
        if (this.type === 'monster') {
            new MiniMonsterSheet(this).render(true);
        }
        else {
            new MiniCharSheet(this).render(true);
        }
    }


}