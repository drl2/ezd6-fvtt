export default class EZCombatant extends Combatant {

    _getInitiativeFormula = function () {
        return (this.actor.type === "character") ? "100" : "0";
      }

    _onCreate(data, options, userId) {
        super._onCreate(data, options, userId);

        if (this.isOwner) {
          this.setFlag("ezd6", "hasActed", false);   
          this.rollInitiative();
        }
    }
  }