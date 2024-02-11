// Handles fantasy name generation
function generateFantasyName(root, subfolder, namelist=null, gender=null, surname=false, title=null, epithet=null)
{
    let generatedName = '';
    let race = localStorage.getItem('subfolder').slice(6); // gets base race
    gender = gender.toLowerCase();
    namelist = namelist.toLowerCase();

    // Special conditions
    if(namelist == "virtue") // genderless and no surnames, ignore inputs
    {
        gender = "neutral";
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
        subraceTitles = subraceTitles.concat(data[namelist + gender]);
        subraceTitles = subraceTitles.concat(data[namelist + 'neutral']);

        // Check for race specific titles
        raceTitles = raceTitles.concat(data[race + gender]);
        raceTitles = raceTitles.concat(data[race + 'neutral']);

        // Check for generic titles
        genericTitles = genericTitles.concat(data[gender]);
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
        const names = data[gender];

        generatedName += randomItem(names) + ' '

        if(surname)
        {
            const sur = data['surname'];
            let pickedSur = randomItem(sur);

            if(gender == 'female')
            {
                if(namelist == 'nordic')
                { 
                    if(pickedSur.endsWith('ssen') || pickedSur.endsWith('sson'))
                    {
                        pickedSur = pickedSur.slice(0, -3) + randomItem(['dottir', 'datter', 'dotter']);
                    }
                    else if(pickedSur.endsWith('sen') || pickedSur.endsWith('son'))
                    {
                        pickedSur = pickedSur.slice(0, -2) + randomItem(['dottir', 'datter', 'dotter']);
                    }
                    generatedName += pickedSur;
                }
                
            }

            if(namelist == 'eastern')
            {
                generatedName = pickedSur + ' ' + generatedName.slice(0, -1);
            }

            else if(namelist == 'slavic')
            {
                if(gender == 'female')
                {
                    if(pickedSur.endsWith('ov') || pickedSur.endsWith('ev') || pickedSur.endsWith('in') || pickedSur.endsWith('r'))
                    {
                        if(Math.random() < 0.5)
                        {
                            pickedSur += 'a';
                        }
                        else
                        {
                            pickedSur += 'na';
                        }
                    }
                }
                else
                {
                    if((pickedSur.endsWith('ov') || pickedSur.endsWith('ev')) && Math.random() < 0.4)
                    {
                        pickedSur += 'ich'
                    }
                }
                generatedName += pickedSur;
            }
            else
            {
                generatedName += pickedSur;
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
        subraceNicks = subraceNicks.concat(data[namelist + gender]);
        subraceNicks = subraceNicks.concat(data[namelist + 'neutral']);

        // Check for race specific nicks
        raceNicks = raceNicks.concat(data[race + gender]);
        raceNicks = raceNicks.concat(data[race + 'neutral']);

        // Check for generic nicks
        genericNicks = genericNicks.concat(data[gender]);
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

// Handles fantasy location generation
function generateFantasyLocation(root, subfolder, list, race, size)
{
    const data = getNamelist(root, subfolder, list);
    race = race.toLowerCase();
    size = size.toLowerCase();
    let generatedName = '';
    switch(list)
    {
        case 'realms':
            let tierRacial = data[(race + size)];
            const tierGeneric = data[size];

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

            let name = '';
            // Weighted choice between random construction sets or pre-made sets
            if(Math.random() < 0.55)
            {
                name = randomItem(data[race]);
            }
            else
            {
                try
                {
                    // Check if racial randoms exist
                    if(data[race + 'random'].length != 0)
                    {
                        name = randomItem(data[race + 'random']);
                    }
                }
                catch(error) {
                    name = randomItem(data[race]);
                }
            }
            if(name.includes('random-'))
            {
                const randomParameters = name.split('-');
                name = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3]);
            }
            return  tier + ' of ' + name;

        case 'settlements':
            generatedName = randomItem(data[race]);
            
            if(generatedName.includes('random-'))
            {
                const randomParameters = generatedName.split('-');
                let excludes = [];
                // Exclude all other races from subgeneration
                const options = document.getElementById('opt1select').options;
                for(let i = 0; i < options.length; i++)
                {
                    element = options[i].value.toLowerCase();
                    excludes.push(element + '-');
                    excludes.push('-' + element);
                }

                
                excludes = excludes.filter(s => !s.includes(race));
                if(generatedName.includes('nature'))
                {

                    generatedName = generateSimple(root, randomParameters[1], randomParameters[2], excludes);
                }
                else
                {
                    generatedName = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3], excludes);
                }
            }
            let descriptor = randomItem(data[size]);

            // Descriptors with spaces at the front should not appear before
            if(descriptor.charAt(0) == ' ')
            {
                generatedName += descriptor;
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

        case 'inns':
            // Use predefined names
            let randomParameters = [];
            let prefix = '';
            if(Math.random() < 0.3)
            {
                prefix = randomItem(data['prefix']);
                if(prefix.includes('random-'))
                {
                    randomParameters = prefix.split('-');
                    if(prefix.includes('nature'))
                    {
                        prefix = generateSimple(root, randomParameters[1], randomParameters[2]);
                    }
                    else
                    {
                        prefix = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3]);
                    }

                }
            }
            // Construct one from the other keys
            else
            {
                const noun = randomItem(['animals', 'objects', 'people'])
                let descriptors = ['quantity', 'colors', 'materials'];
                if(noun != 'objects')
                {
                    descriptors.push('adjectives');
                }
                const descriptorCategory = randomItem(descriptors);
                randomParameters = randomItem(data[descriptorCategory]).split('-');
                prefix =  getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3]);
                randomParameters = randomItem(data[noun]).split('-');
                if(descriptorCategory == 'quantity')
                {
                    prefix += ' ' +  pluralizeNoun(getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3]));
                }
                else
                {
                    prefix += ' ' +  getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3]);
                }
            }
            generatedName = 'The ' + prefix;
            
            // Add "Inn" or "Tavern" style endings
            if(Math.random() < 0.55)
            {
                generatedName += ' ' + randomItem(data['suffix'])
            }
            return generatedName;
    }
}

// Handles fantasy organization generations
function generateFantasyOrg(root, subfolder, list, opt1, opt2)
{
    const data = getNamelist(root, subfolder, list);
    let generatedName = '';
    opt1 = opt1.toLowerCase();
    opt2 = opt2.toLowerCase();
    switch(list)
    {
        case 'guilds':
            return randomItem(data[opt1]) + ' ' + randomItem(data['suffix']);
        case 'gangs':
            return generateSimple(root, subfolder, list);
        case 'orders':
            if(Math.random() < 0.5)
            {
                return randomItem(data[opt2]) + ' ' + randomItem(data['prefix']) + ' ' + randomItem(data['name']);
            }
            else
            {
                return randomItem(data[opt2]) + ' ' + randomItem(data['suffix']) + ' ' + randomItem(data['name']);
            }
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
            return generatedName;
    }
}