# Macro Helper Functions

Several functions have been added to the system to simplify adding common rolls to the hotbar.  All rolls generated are based on the currently selected actor and will fail if no actor is selected.

![Macro Examples](/doc-images/Roll%20Macro%20Examples.webp)

## rollTask
Rolls an attack, save, or general task check.  Takes the type of roll for an argument; options are "attack", "wound" or "miraculous" for saves, and "task" (or no argument) for a generic task roll.


Example:

`game.ezd6.rollTask("attack");`

`game.ezd6.rollTask();`


## rollCast
Rolls an attempt to cast a spell or ask for a miracle, with output formatted to show all the rolled dice to quickly spot those "1" rolls.

Examples:

`game.mp.rollCast("spell");`

`game.mp.rollCast("miracle");`



## rollHeroDie
If the current actor has any Hero Dice, roll one and remove it from their Hero Dice count.

Examples:

`game.mp.rollHeroDie();`


## rollResist
Roll magic resistance for the current selected actor.

Examples:

`game.mp.rollResist();`


[EZD6 README](README.md)
