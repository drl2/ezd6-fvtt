# Handling Inititative

Initiative in EZD6 amounts to "players go first in whatever order they want, followed by monsters".  Foundry is currently built to default to a traditional ordered-by-die-roll turn order and doesn't really know what to make of this "go when you feel like it" concept.  So for EZD6, the Foundry combat tracker has been stripped down and simplified.  Actual initiative numbers are hidden, but all characters added are assigned the same high number when added to a combat and all monsters are assigned the same low number, resulting in a characters-first list.  Each actor in the combat has a checkbox next to it that the player or GM can toggle to indicate that actor has taken their turn this round.  These checkmarks are cleared out at the beginning of each new round.

![Initiative Tracker](/doc-images/init-tracker.webp)

Of course, there's nothing forcing the GM to even use the combat tracker at all.

[EZD6 README](README.md)