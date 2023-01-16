import { EZD6 } from "./config.js";
import EZD6CharacterSheet from "./sheets/EZD6CharacterSheet.js";
import EZD6ItemSheet from "./sheets/EZD6ItemSheet.js";
import EZActor from "./ezactor.js";
import EZItem from './ezitem.js';
import EZCombatTracker from "./ezcombatTracker.js";
import EZCombatant from "./ezcombatant.js";
import EZCombat from "./ezcombat.js";
import * as Macros from './macros.js';
import {MiniCharSheet} from "./sheets/minicharsheet.js";
import {MiniMonsterSheet} from "./sheets/minimonstersheet.js";

Hooks.once("init", function() {
    console.log("***** EZD6 initializing   *********");

    checkDsNSetting();
    registerSystemSettings();

    CONFIG.Actor.documentClass = EZActor;
    CONFIG.Item.documentClass = EZItem;
    CONFIG.Combatant.documentClass = EZCombatant;
    CONFIG.ui.combat = EZCombatTracker;
    CONFIG.Combat.documentClass = EZCombat;

    game.ezd6 = {
        macros: Macros,
        rollTask: Macros.rollTask,
        rollCast: Macros.rollCast,
        rollHeroDie: Macros.rollHeroDie
    }

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet(game.system.id, EZD6CharacterSheet, {makeDefault: true });
    
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet(game.system.id, EZD6ItemSheet, {makeDefault: true });

});


Hooks.once("ready", function() {
    // one-time-only - set recommended setting for multi-rolling if Dice So Nice is in use
    if(!game.settings.get(game.system.id, "dsnSettingInit")){
        game.settings.set("dice-so-nice","enabledSimultaneousRollForMessage",false);
        game.settings.set(game.system.id, "dsnSettingInit",true);
    }
});

Hooks.on('getEZD6CharacterSheetHeaderButtons', function(sheet, buttons) {
    buttons.unshift({
        label: game.i18n.localize('EZD6.MiniSheet'),
        icon: "fas fa-window",
        class: "none",        
        onclick: () => sheet.showMini(),
    });
})

Hooks.on('getActorDirectoryEntryContext', (app, options)=>{
    options.push(
      {
        "name": game.i18n.localize('EZD6.OpenMini'),
        "icon": `<i class="fas fa-window"></i>`,
        "element": {},
        condition: li => {
            const actor = game.actors.get(li.data("documentId"));
            return actor.isOwner;
        },
        callback: li => {
            const actor = game.actors.get(li.data("documentId"));
            chooseMiniSheet(actor);
        }
      }
    )
  })

  Hooks.on('renderTokenHUD', (app, html, data) => {
    const actor = canvas.tokens.get(data._id).actor;

    const button = $('<div class="control-icon open-mini" title="' + 
    game.i18n.localize('EZD6.MiniSheet') +
        '"><i class="fas fa-window"></i></div>');

    html.find('.col.left').append(button).click(chooseMiniSheet.bind(this, actor));
  })

  function chooseMiniSheet(actor) {
    if (actor.type === 'monster') {
        new MiniMonsterSheet(actor).render(true);
    }
    else {
        new MiniCharSheet(actor).render(true);
    }
  }

function checkDsNSetting() {
    game.settings.register(game.system.id, "dsnSettingInit", {
        name: "Flag for Dice So Nice settings init",
        scope: "world",
        config: false,
        type: Boolean,
        default: false
    });
};

function registerSystemSettings() {
    game.settings.register(game.system.id, "showKarmaChangeInChat", {
        config: true,
        scope: "world",
        name: "SETTINGS.karmaChangeInChat.name",
        hint: "SETTINGS.karmaChangeInChat.label",
        type: String,
        choices: {
            "never": "EZD6.Never",
            "rronly": "EZD6.ShowRROnly",
            "everyone": "EZD6.ShowEveryone"
        },
        default: "never"
    });

    game.settings.register(game.system.id, "showChangeHeroDice", {
        config: true,
        scope: "world",
        name: "SETTINGS.showChangeHeroDice.name",
        hint: "SETTINGS.showChangeHeroDice.label",
        type: String,
        choices: {
            "never": "EZD6.Never",
            "rronly": "EZD6.ShowRROnly",
            "everyone": "EZD6.ShowEveryone"
        },
        default: "never"
    });

    game.settings.register(game.system.id, "showCharacterToHit", {
        config: true,
        scope: "world",
        name: "SETTINGS.showCharacterToHit.name",
        hint: "SETTINGS.showCharacterToHit.label",
        type: Boolean,
        default: false
    });

    game.settings.register(game.system.id, "showCharacterMagicResist", {
        config: true,
        scope: "world",
        name: "SETTINGS.showCharacterMagicResist.name",
        hint: "SETTINGS.showCharacterMagicResist.label",
        type: Boolean,
        default: false
    });
    

};