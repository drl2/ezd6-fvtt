# Version 1.1.0 Changes

A fair number of new features were added in this release, so it made sense to add this document to describe them in more detail than a simple change history would cover.

## Mini Sheets

The standard character sheets with their descriptions, lists of features, equipment, etc., take up a lot screen space.  In a simple system like EZD6, most of this needs to be referenced only occasionally after character creation.  For the rest of the time - and when the RR has to keep track of a number of actors in the same scene - the new "mini sheets" are an alternative that allows the display of relevant stats and buttons for common actions, but without those details gobbling up all your pixels.

There are multiple ways to open a mini sheet.

- Right-click a token to bring up its HUD and click the window-like icon on the bottom left.
- Click the "Mini Sheet" link in the title bar of the regular character or monster sheets.
- Right-click an actor in the actors tab and choose the "Open Mini Sheet" item from the context menu.

![Opening Mini Sheets](/doc-images/OpenMiniSheet.jpg)

Mini sheets for characters show Strikes, Hero Dice, and Karma.  Left-clicking any of these sections will spend one point of the relevant stat, while right-clicking will add one to the stat total.  Below the stats a row of buttons provide access to common rolls - mousing over each button will pop up its description.

![Mini Sheets](/doc-images/MiniSheets.jpg)

The monster sheet works the same way, but monsters are simpler so it just displays Strikes and a smaller selection of roll buttons on the same line.  Both character and monster sheets will expand downward if needed to accomodate higher stat values than will fit on a single line.

Macros in the new compendium (see below) include one to open the mini sheets for all tokens on the current scene or for all tokens in the current combat.

(Thanks to @Allen from the EZD6 Discord for the idea & example code for this!)


## Customization options

EZD6 has already spawned a lot of homebrew and customization.  As a small step in support of customization, the RR can optionally now allow the To Hit and Magic Resistance values to be editable for cases where they might differ from the default.  They can also, for instance, turn one of these features on, change the value for a character, then turn the feature off to lock in the new value.

These features are both turned off by default.

![System Settings](/doc-images/V110SystemSettings.jpg)

## Character, Monster, and Item Sheet Additions

An assortment of minor tweaks to the character and monster sheets:
- Hero Dice and Karma had a one-click mechanism to add or remove values, but Strikes didn't.  Added +/- buttons there.
- Added roll buttons for magic resistance.
- Added description sections to both character and monster sheets.  These use the TinyMCE editor so can include formatting, tables, links, etc.
- Added a ">>" button next to Karma to spend 5 to restore a Hero Die.

![v1.1.0 Character Sheet](/doc-images/v110CharacterSheet.jpg)

For item sheets:
- Description boxes have been switched to TinyMCE for more formatting options.
- In response to several requests for more sub-types on the "Equipment" gear type, "Magic" and "Other" categories are now available.

![v1.1.0 Item Sheet](/doc-images/v110ItemSheet.jpg)

## Other System Settings

There were a couple of requests for a feature to send a notification whenever an actor's Karma is changed.  Options have been added to the system configuration (screenshot above) allow the RR to specify for both Karma and Hero Dice to post notifications to chat only for the RR, for everyone, or never (the default, because anything else gats annoying fast).

## Macro Changes

A new compendium with a small list of macros is now part of the system.  At this time they include simple macros for most types of rolls, plus those mentioned above for bulk-opening mini sheets.  Others will be added here over time.

[EZD6 README](README.md)