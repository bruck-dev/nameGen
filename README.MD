# Bruck's Fantasy Name Generator
A highly curated name generator for fantasy applications, such as DND, Baldur's Gate, or other generic fantasy environments.
I've handpicked most of the contents in the namelists to things I would actually use. I've found that most online generators
default to using Markov generators or using prefix/suffix construction which can lead to weird or undesirable results;
this is my personal project to always have *something* that I'd actually want to use.

Requires Python 3.10 or newer. See requirements.txt for more information.


## Name Generator
Has broad support for the following:
- Races:
    - Human
        - Western European Style
        - Northern/Eastern European Style
        - Eastern/Asian Style
    - Elf
        - High Elf
        - Wood Elf
        - Drow
        - Dark Elf
    - Dwarf
        - Generic Dwarf
    - Halfing
        - WIP
    - Orc
        - WIP
    - Tiefling
        - Infernal Style
        - 'Virtue' Style

Names can also be generated with added titles, nicknames, etc. to start formulating a personality or societal role for your character.


## Namelist Editor
I've also added a tab to view, add to, or replace the current namelist via a textbox. Inputs in the box should be formatted like the following:

Multiple Entries
- Put a space or comma and a space between entries. I.e: 'Bruck Goose' or 'Bruck, Goose'
Multiple Word Entries
- Surround in double quotes. I.e, '"Bruck Goose"'. This will be treated as one entry and will obey other rules.
- Note: single quotes are not counted as a divider and can be used freely. 'Bruck'Goose' is equally as valid as 'Bruck'.


## Music Player
For some reason I also put in a music player. Put .mp3, .wav, or .flac files into the assets/music folder and they'll show up on the player tab. If there's nothing there the tab won't appear.
