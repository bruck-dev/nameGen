// Handles fantasy name generation
function generateFantasyName(root, subfolder, namelist=null, gender=null, surname=false, title=null, epithet=null)
{
    let generatedName = '';
    let race = localStorage.getItem('subfolder').slice(6); // gets base race

    // Special conditions
    if(namelist == "Virtue") // genderless and no surnames, ignore inputs
    {
        gender = "Neutral";
        surname = false;
    }
    
    // Picks a title
    if(title)
    {
        const data = getNamelist(root, 'shared/titles', title);
        let subraceTitles = [];
        let raceTitles =[];
        let genericTitles = [];

        // Check for subrace titles
        subraceTitles = subraceTitles.concat(data[namelist.toLowerCase() + gender.toLowerCase()]);
        subraceTitles = subraceTitles.concat(data[namelist.toLowerCase() + 'neutral']);

        // Check for race specific titles
        raceTitles = raceTitles.concat(data[race + gender.toLowerCase()]);
        raceTitles = raceTitles.concat(data[race + 'neutral']);

        // Check for generic titles
        genericTitles = genericTitles.concat(data[gender.toLowerCase()]);
        genericTitles = genericTitles.concat(data['neutral']);

        // Remove any undefined values, i.e. disregarding any namelists that don't exist
        subraceTitles = subraceTitles.filter(function( element ) {
            return element !== undefined;
         });

        raceTitles = raceTitles.filter(function( element ) {
            return element !== undefined;
        });

        genericTitles = genericTitles.filter(function( element ) {
            return element !== undefined;
        });

        // Pick a random from the lists, weighted. Checks if lists have values first.
        generatedTitle = '';
        const rando = Math.random();
        if(raceTitles.length == 0 && subraceTitles.length == 0)
        {
            generatedTitle = randomItem(genericTitles);
        }
        else if(subraceTitles.length == 0 && raceTitles.length != 0)
        {
            if(rando < 0.6)
            {
                generatedTitle = randomItem(raceTitles);
            }
            else
            {
                generatedTitle = randomItem(genericTitles);
            }
        }
        else if(subraceTitles.length != 0 && raceTitles.length == 0)
        {
            if(rando < 0.6)
            {
                generatedTitle = randomItem(subraceTitles);
            }
            else
            {
                generatedTitle = randomItem(genericTitles);
            }
        }
        else
        {
            if(rando < 0.45)
            {
                generatedTitle = randomItem(subraceTitles);
            }
            else if(rando < 0.70)
            {
                generatedTitle = randomItem(raceTitles);
            }
            else
            {
                generatedTitle = randomItem(genericTitles);
            }
        }

        generatedName += generatedTitle + ' ';
    }

    // Picks a given name and surname if enabled
    if(namelist)
    {
        const data = getNamelist(root, subfolder, namelist);
        const names = data[gender.toLowerCase()];

        generatedName += randomItem(names) + ' '

        if(surname)
        {
            const sur = data['surname'];
            if(gender == 'Female' && namelist == 'Northern')
            {
                let pickedSur = randomItem(sur);
                if(pickedSur.endsWith('ssen') || pickedSur.endsWith('sson'))
                {
                    pickedSur = pickedSur.slice(0, -3) + randomItem(['dottir', 'datter', 'dotter']);
                }
                else if(pickedSur.endsWith('sen') || pickedSur.endsWith('son'))
                {
                    pickedSur = pickedSur.slice(0, -2) + randomItem(['dottir', 'datter', 'dotter']);
                }
                else if(pickedSur.endsWith('ov'))
                {
                    pickedSur += 'a';
                }
                generatedName += pickedSur;
            }
            else
            {
                generatedName += randomItem(sur);
            }
        }
    }

    // Picks an epithet if enabled
    if(epithet)
    {
        const data = getNamelist(root, 'shared/epithets', epithet);
        let nick = '';
        let subraceNicks = [];
        let raceNicks =[];
        let genericNicks = [];

        // Check for subrace nicks
        subraceNicks = subraceNicks.concat(data[namelist.toLowerCase() + gender.toLowerCase()]);
        subraceNicks = subraceNicks.concat(data[namelist.toLowerCase() + 'neutral']);

        // Check for race specific nicks
        raceNicks = raceNicks.concat(data[race + gender.toLowerCase()]);
        raceNicks = raceNicks.concat(data[race + 'neutral']);

        // Check for generic nicks
        genericNicks = genericNicks.concat(data[gender.toLowerCase()]);
        genericNicks = genericNicks.concat(data['neutral']);

        // Remove any undefined values, i.e. disregarding any namelists that don't exist
        subraceNicks = subraceNicks.filter(function( element ) {
            return element !== undefined;
         });

        raceNicks = raceNicks.filter(function( element ) {
            return element !== undefined;
        });

        genericNicks = genericNicks.filter(function( element ) {
            return element !== undefined;
        });

        // Pick a random from the lists, weighted. Checks if lists have values first.
        const rando = Math.random();
        if(raceNicks.length == 0 && subraceNicks.length == 0)
        {
            nick = randomItem(genericNicks);
        }
        else if(subraceNicks.length == 0 && raceNicks.length != 0)
        {
            if(rando < 0.6)
            {
                nick = randomItem(raceNicks);
            }
            else
            {
                nick = randomItem(genericNicks);
            }
        }
        else if(subraceNicks.length != 0 && raceNicks.length == 0)
        {
            if(rando < 0.6)
            {
                nick = randomItem(subraceNicks);
            }
            else
            {
                nick = randomItem(genericNicks);
            }
        }
        else
        {
            if(rando < 0.45)
            {
                nick = randomItem(subraceNicks);
            }
            else if(rando < 0.70)
            {
                nick = randomItem(raceNicks);
            }
            else
            {
                nick = randomItem(genericNicks);
            }
        }
        if(nick.charAt(0) == ' ')
        {
            generatedName += ',' + nick;
        }
        else
        {
            generatedName += ' ' + nick;
        }
    }

    return generatedName;
}

// Handles fantasy uniques
function generateFantasyUnq(root, subfolder, list)
{
    let generatedName = '';
    const data = getNamelist(root, subfolder, list);
    let prefix = ''

    switch(list)
    {
        case 'magicacademy':
            

            prefix = randomItem(data['prefix']);

            // Check if prefix includes random sublist selectors
            if(prefix.includes('random-'))
            {
                let randomParameters = prefix.split('-');
                if(!prefix.includes('surname')) // Nature case
                {
                    prefix = generateSimple(root, randomParameters[1], randomParameters[2]);
                }
                else // Surname founder case
                {
                    prefix = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3]);
                }
            }
            generatedName += prefix;
            if(Math.random() < 0.25)
            {
                let optPrefix = randomItem(data['optionalprefix']);
                generatedName += ' ' + optPrefix;
            }
            generatedName += ' ' + randomItem(data['type']);
            if(Math.random() < 0.5)
            {
                generatedName += ' ' + randomItem(data['optionalsuffix']);
            }
            break;

        case 'inns':
            // Use predefined names
            let randomParameters = [];
            if(Math.random() < 0.5)
            {
                prefix = randomItem(data['prefix']);
                if(prefix.includes('random-nature'))
                {
                    randomParameters = prefix.split('-');
                    prefix = generateSimple(root, randomParameters[1], randomParameters[2]);
                }
            }
            // Construct one from the other keys
            else
            {
                const noun = randomItem(['animals', 'objects', 'people'])
                let descriptors = data['colors'].concat(data['metals']);
                if(noun != 'objects')
                {
                    descriptors = descriptors.concat(data['adjectives']);
                }
                prefix =  randomItem(descriptors) + ' ' +  randomItem(data[noun]);
            }
            generatedName = 'The ' + prefix;
            
            // Add "Inn" or "Tavern" style endings if its not a random-style name or at 50/50 odds
            if(Math.random() < 0.5 || randomParameters.length != 0)
            {
                generatedName += ' ' + randomItem(data['suffix'])
            }
    }
    return generatedName;
}

// Handles fantasy location generation
function generateFantasyLocation(root, subfolder, list, race, size)
{
    const data = getNamelist(root, subfolder, list);
    switch(list)
    {
        case 'realms':
            let tierRacial = data[(race + size).toLowerCase()];
            const tierGeneric = data[size.toLowerCase()];

            if(tierRacial != undefined)
            {
                tierRacial = tierRacial.filter(function( element ) {
                    return element !== undefined;
                 });
            }
            else
            {
                tierRacial = [];
            }

            let tier = ''
            if(Math.random() < 0.6 && tierRacial.length > 0)
            {
                tier = randomItem(tierRacial);
            }
            else
            {
                tier = randomItem(tierGeneric);
            }

            let name = randomItem(data[race.toLowerCase()]);
            if(name.includes('random-'))
            {
                const randomParameters = name.split('-');
                name = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3]);
            }
            return  tier + ' of ' + name;

        case 'settlements':
            let generatedName = randomItem(data[race.toLowerCase()]);
            let descriptor = randomItem(data[size.toLowerCase()]);

            // Plural descriptors must go at the end
            if(descriptor.slice(-1) == 's' && descriptor.slice(-2) != 'ss')
            {
                generatedName += ' ' + descriptor;
            }
            // Descriptors with spaces at the end should not appear after
            else if(descriptor.slice(-1) == ' ')
            {
                generatedName = descriptor + generatedName;
            }
            // Randomly decide if the remaining descriptors should be X of Y or Y X
            else if(Math.random() < 0.5)
            {
                generatedName = descriptor + ' of ' + generatedName;
            }
            else
            {
                generatedName += ' ' + descriptor;
            }
            return generatedName;
    }
}

// Handles fantasy organization generations
function generateFantasyOrg(root, subfolder, list, opt1, opt2)
{
    console.log(list);
    const data = getNamelist(root, subfolder, list);
    switch(list)
    {
        case 'guilds':
            return randomItem(data[opt1.toLowerCase()]) + ' ' + randomItem(data['suffix']);
        case 'orders':
            if(Math.random() < 0.5)
            {
                return randomItem(data[opt2.toLowerCase()]) + ' ' + randomItem(data['prefix']) + ' ' + randomItem(data['name']);
            }
            else
            {
                return randomItem(data[opt2.toLowerCase()]) + ' ' + randomItem(data['suffix']) + ' ' + randomItem(data['name']);
            }
    }
}