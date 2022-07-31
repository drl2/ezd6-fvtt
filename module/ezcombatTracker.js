export default class EZCombatTracker extends CombatTracker { 
    get template() {
        return `systems/ezd6/templates/system/combat-tracker.hbs`;
    }

    
    activateListeners(html) {
        super.activateListeners(html);

        html.find('.has-gone').click(this._onToggleHasGone.bind(this));
    }

    
    async _onToggleHasGone(event) {
        const btn = event.currentTarget;
        const li = btn.closest(".combatant");
        const c = this.viewed.combatants.get(li.dataset.combatantId);
        const hasActed = c.getFlag("ezd6", "hasActed");
        c.setFlag("ezd6", "hasActed", !hasActed);
    }
    
    async getData() {
        let data = await super.getData();

        if (!data.hasCombat) {
            return data;
        }

        for (let [i, combatant] of data.combat.turns.entries()) {
            data.turns[i].hasActed = combatant.getFlag("ezd6", "hasActed");
        };

        return data;
    }
}
