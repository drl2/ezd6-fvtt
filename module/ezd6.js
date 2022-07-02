import { EZD6 } from "./config.js";
import EZD6CharacterSheet from "./sheets/EZD6CharacterSheet.js";


Hooks.once("init", function() {
    console.log("***** EZD6 initializing   *********");

    checkDsNSetting();
    registerSystemSettings();

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet(game.system.id, EZD6CharacterSheet, {makeDefault: true });
});


Hooks.once("ready", function() {
    // one-time-only - set recommended setting for multi-rolling if Dice So Nice is in use
    if(!game.settings.get(game.system.id, "dsnSettingInit")){
        game.settings.set("dice-so-nice","enabledSimultaneousRollForMessage",false);
        game.settings.set(game.system.id, "dsnSettingInit",true);
    }
});


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

};