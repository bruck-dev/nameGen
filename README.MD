# Bruck's Name Generator
A highly curated name generator originally created for fantasy applications, but quickly spiraled beyond that scope once I moved towards using
Github Pages instead of a Python desktop app.

I've often found that online generators use prefix/suffix construction or Markov chain generation. These are useful tools, but can often
create fairly undesirable results if the components aren't selected carefully. This is my personal answer to what's probably a gripe
only I have. I've included fairly broad support for classic fantasy/DND races already, and I'm actively expanding it beyond that scope.


## Namelist Editor
The Python app will autodetect any JSON files in the assets/namelist folder, and allow you to edit it via root/subfolder/file/key selection boxes.

Multiple Entries
- Put a space or comma and a space between entries. I.e: 'Bruck Goose' or 'Bruck, Goose'
Multiple Word Entries
- Surround in double quotes. I.e, '"Bruck Goose"'. This will be treated as one entry and will obey other rules.
- Note: single quotes are not counted as a divider and can be used freely. 'Bruck'Goose' is equally as valid as 'Bruck'.


## Music Player
For some reason I also put in a music player. Put .mp3, .wav, or .flac files into the assets/music folder and they'll show up on the player tab. If there's nothing there the tab won't appear. Doesn't exist on the web version.
