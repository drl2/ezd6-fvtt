export default class EZCombat extends Combat { 

    /**
     * Reset all initiatives at top of new round
     */
    async nextRound() {
        this.combatants.forEach(c => {
            c.setFlag("ezd6", "hasActed", false);
        });

        super.nextRound();
    }

}