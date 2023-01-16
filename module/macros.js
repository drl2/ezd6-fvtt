export function rollTask(rollType) {
    const speaker = ChatMessage.getSpeaker();
    let actor;
    if (speaker.token) actor = game.actors.tokens[speaker.token];
    if (!actor) actor = game.actors.get(speaker.actor);

    if (!actor) { return ui.notifications.warn(game.i18n.localize("WARNINGS.NoActorSelected")); }

    const dataset = {
        rolltype: (rollType) ? rollType : "task"
    }

    actor.doRoll(dataset);
}


export function rollCast(rollType) {
    const speaker = ChatMessage.getSpeaker();
    let actor;
    if (speaker.token) actor = game.actors.tokens[speaker.token];
    if (!actor) actor = game.actors.get(speaker.actor);

    if (!actor) { return ui.notifications.warn(game.i18n.localize("WARNINGS.NoActorSelected")); }

    const dataset = {
        rolltype: rollType
    }

    actor.rollCast(dataset);
}


export function rollHeroDie() {
    const speaker = ChatMessage.getSpeaker();
    let actor;
    if (speaker.token) actor = game.actors.tokens[speaker.token];
    if (!actor) actor = game.actors.get(speaker.actor);

    if (!actor) { return ui.notifications.warn(game.i18n.localize("WARNINGS.NoActorSelected")); }

    actor.rollHeroDie({});
}


export function rollResist() {
    const speaker = ChatMessage.getSpeaker();
    let actor;
    if (speaker.token) actor = game.actors.tokens[speaker.token];
    if (!actor) actor = game.actors.get(speaker.actor);

    if (!actor) { return ui.notifications.warn(game.i18n.localize("WARNINGS.NoActorSelected")); }

    actor.rollResist();
}
