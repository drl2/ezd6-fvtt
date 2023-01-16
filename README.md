# EZD6 system for FoundryVTT
Foundry VTT system for playing Scotty McFarland's EZD6.

## The Game
[EZD6](https://www.drivethrurpg.com/product/397599/EZD6-Core-Rulebook?affiliate_id=1692486) by Scotty McFarland (a.k.a. "DM Scotty") is "A rules-light D6 RPG system that puts creativity over complexity, but delivers a suprising amount of variation and mechanical wiggle".

This code is an open source project unaffiliated with the game.

## Using this System
In keeping with the simplicty of the EZD6 system, automation is minimal - it's really not needed here and could get in the way!

All character and monster features except for the basic stats are types of Items in Foundry, meaning the Rabble Rouser (GM) can build their own collections and compendiums of features to easily drag and drop onto new creations.

## Other Documentation:
- [Handling Initiative](initiative.md)
- [Built-in Macros](macro-helpers.md)
- [New features in version 1.1.0](v110_changes.md)

## Nice To Have Maybe Someday But Let's Get the Core System Well Tested First

- Option to show roll results in chat as actual die faces
- User-configurable names for item types (e.g. calling Hero Path items something like "Superhero Origin") for easy re-skinning to adapt to different genres inside the EZD6 rule set.

## Support
This is a hobby project so I can't guarantee a fast response to questions, but I'll be at least semi-regularly visting [Scotty's Discord](https://discord.gg/Abp22Ja6aK) to reply to questions and feedback.  (I'm @drl2 there.)

## Contributing
EZD6 is simple enough that I'm not looking for assistance in developing the functional system at this time.  However, assistance in the following areas is welcome:
- Non-English translation
- A better default character icon!

## The Other Kind of Contributing
This project is free and open source, but if you're feeling generous and would like to Toss A Coin to your Coder (try explaining that one when somebody reads this in five years!), there a a few ways to do so:

- Donate via [ko-fi](https://ko-fi.com/drl2461951)
- Buy stuff through my [DriveThruRPG affiliate link](https://www.drivethrurpg.com/?affiliate_id=1692486)
- Use this [Amazon link](https://amzn.to/3kGDqgc) when you're planning to make a purchase from that particular giant evil megacorp.
- Stop in to read my occasional [gaming blog](https://gaming.drl2.com) once in a while.  

## Change Log

### [1.1.0] - 2023-01-16
- There are enough small quality-of-life and customization-enabling changes in this version to warrant some [dedicated new documentation](v110_changes.md).
- Modifications for better Foundry V10 (and beyond) compatibility.  ***This version will only work with Foundry 10 or higher.  Continue using v1.0.1 in Foundry 9.***  Changes related to v10 include:
    - Revised a lot of soon-to-be-deprecated code to use newer ways of doing things that should ease the transition into future Foundry versions
    - Fixed some display issues with the Combat Tracker caused ny changes to the underlying layout
- Added description fields to monster and character sheets
- Item descriptions are now formattable rather than plain text
- There were several (potentially conflicting) requests for more sub-types for Equipment; compromised by adding "Magic" and "Other" types as catch-alls for what doesn't quite fit elsewhere
- Added a button to replenish a Hero Die by spending 5 Karma
- Added system options (Game Settings -> Configure Settings -> EZD6) to show Karma and Hero Dice changes in chat.  Turned off ("Never") by default.
- Added a system option to show 'to hit' on player chharacter sheet like on monster sheet.  Off by default - this is mainly for RRs who want to customize the rules
- Added magic resistance roller to character & monster sheets.  Magic resistance dice can be specified on the monster sheet, and a system option is avaliable to make the # of dice editable for player characters.
- Added magic roll button to monster sheet for magic casting or spell-like powers (e.g. dragon breath)
- Added plus/minus icons for single-click increment/decrement of strikes
- Added magic section to monster sheet 
- Added "mini sheet" capability for characters and monsters.  These are small displays with name, basic stats, and buttons for basic roll types that take up very little space on screen, so now full-size character sheets can stay closed most of the time.  See the separate [New features in version 1.1.0](v110_changes.md) documentation for more info.  *Thanks to @Allen on the EZD6 Discord for inspiration and example code on this.*
 - To avoid confusion with the ability to pray for a miracle, the "rollTask" macro helper now expects "miraculous" instead of "miracle" as the argument to make a miraculous save.
 - Added a small library of macros


### [1.0.1] - 2022-09-15
- Minor config changes to suppress warning messages at startup on Foundry v10.  Currently still supports v9 but future versions will probably be v10 only.

### [1.0.0] - 2022-07-31
- First full release
- Simple initiative sorts players above monsters and provides checkmark toggles to keep track of who's acted already this turn.  Using Foundry settings to show to-hit values here is useful.
- Added a basic "Task Check" button as a catch-all for any other rolls to character & monster sheets
- Added macro "helpers" for setting up basic roll macros.  With a few of these set up and strikes and karma set as token resources, visits to the character sheet during combat can be relatively rare.
- With the above in mind, strikes and karma are now the default token resources.  The GM will still need to set up who they're visible to either for individual tokens or globally from the Core Settings tab of the Configure Settings window.
- More minor tweaks & fixes.


### [0.8.0] - 2022-07-28
- Second public test release
- Monster character sheets
- Spell & Miracle rolls
- Many minor fixes, tweaks, and modifications to 0.5.0 features

### [0.5.0] - 2022-07-24

- Initial public test release
- "Pusher and Shover" character sheets
- Attack, save, and hero die rolls from the character sheet with selectable boon/bane options
- Item types & sheets for all the kinds of items needed

