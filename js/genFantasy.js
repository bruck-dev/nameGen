// Handles fantasy name generation
function generateFantasyName(root, subfolder, namelist=null, gender=null, surname=false, title=null, epithet=null)
{
    let generatedName = '';
    let race = localStorage.getItem('list'); // gets base race
    gender = gender.toLowerCase();
    namelist = namelist.replaceAll(' ', '').toLowerCase();

    // Special conditions
    if(namelist == "virtue") // genderless and no surnames, ignore inputs
    {
        gender = "neutral";
        surname = false;
    }

    // Picks a given name and surname if enabled
    if(namelist)
    {
        const data = getNamelist(root, subfolder + '/' + race, namelist);
        const names = data[gender];

        generatedName += randomItem(names) + ' '

        if(surname)
        {
            const sur = data.surname;
            let pickedSur = randomItem(sur);

            // Special Surname Conditions
            if(race == 'human')
            {
                if(namelist == 'nordic' && gender == 'female')
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
                else if(namelist == 'eastern')                      
                {
                    generatedName = pickedSur + ' ' + generatedName.slice(0, -1);
                }
                else if(namelist == 'slavic')
                {
                    if(gender == 'female')
                    {
                        if(pickedSur.endsWith('ov') || pickedSur.endsWith('ev') || pickedSur.endsWith('r'))
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
                        else if(pickedSur.endsWith('y'))
                        {
                            pickedSur = pickedSur.slice(0, -1) + 'aya';
                        }
                        else if(pickedSur.endsWith('in') || pickedSur.endsWith('z'))
                        {
                            pickedSur += 'a';
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
            else
            {
                generatedName += pickedSur;
            }
        }
    }

    // Picks a title
    if(title)
    {
        const data = getNamelist(root, 'races/shared/titles', title);
        let subraceTitles = [];
        let raceTitles =[];
        let genericTitles = [];

        // Check for subrace titles
        try
        {
            if(data[race][namelist][gender] != undefined)
            {
                subraceTitles = subraceTitles.concat(data[race][namelist][gender]);
            }
            if(data[race][namelist]['neutral'] != undefined)
            {
                subraceTitles = subraceTitles.concat(data[race][namelist]['neutral']);
            }
        }
        catch {}

        // Check for race specific titles
        try
        {
            if(data[race][gender] != undefined)
            {
                raceTitles = raceTitles.concat(data[race][gender]);
            }
            if(data[race]['neutral'] != undefined)
            {
                raceTitles = raceTitles.concat(data[race]['neutral']);
            }
        }
        catch {}

        // Check for generic titles
        try
        {
            if(data.generic[gender] != undefined)
            {
                genericTitles = genericTitles.concat(data.generic[gender]);
            }
            if(data.generic.neutral != undefined)
            {
                genericTitles = genericTitles.concat(data.generic.neutral);
            }
        }
        catch {}

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
            if(rando < 0.35)
            {
                generatedTitle = randomItem(subraceTitles);
            }
            else if(rando < 0.65)
            {
                generatedTitle = randomItem(raceTitles);
            }
            else
            {
                generatedTitle = randomItem(genericTitles);
            }
        }

        generatedName = generatedTitle + ' ' + generatedName;
    }

    // Picks an epithet if enabled
    if(epithet)
    {
        const data = getNamelist(root, 'races/shared/epithets', epithet);
        let nick = '';
        let subraceNicks = [];
        let raceNicks =[];
        let genericNicks = [];

        // Check for subrace nicks
        try
        {
            if(data[race][namelist][gender] != undefined)
            {
                subraceNicks = subraceNicks.concat(data[namelist][gender]);
            }
            if(data[race][namelist]['neutral'] != undefined)
            {
                subraceNicks = subraceNicks.concat(data[namelist]['neutral']);
            }
        }
        catch {}

        // Check for race specific nicks
        try
        {
            if(data[race][gender] != undefined)
            {
                raceNicks = raceNicks.concat(data[race][gender]);
            }
            if(data[race]['neutral'] != undefined)
            {
                raceNicks = raceNicks.concat(data[race]['neutral']);
            }
        }
        catch {}

        // Check for generic nicks
        try
        {
            if(data.generic[gender] != undefined)
            {
                genericNicks = genericNicks.concat(data.generic[gender]);
            }
            if(data.generic.neutral != undefined)
            {
                genericNicks = genericNicks.concat(data.generic.neutral);
            }
        }
        catch {}

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
function generateFantasyLocation(root, subfolder, list, race, subrace, size)
{
    const data = getNamelist(root, subfolder, list);
    if(typeof(size) == 'string') { race = race.toLowerCase(); }
    if(typeof(size) == 'string') { size = size.toLowerCase(); }
    if(typeof(size) == 'string') { subrace = subrace.toLowerCase(); }
    let generatedName = '';
    let tier = ''

    switch(list)
    {
        case 'realms':
            const tierGeneric = data.tier.generic[size];

            // Check if race tiers exist
            let tierRace = data.tier[race][size];
            if(tierRace == undefined)
            {
                tierRace = [];
            }
            
            // Check if subrace tiers exist
            try
            {
                let tierSubrace = data.tier[race][subrace][size];

                const tierSelect = Math.random();
                if(tierSelect < 0.45 && tierSubrace.length > 0)
                {
                    tier = randomItem(tierSubrace);
                }
                else if(tierSelect < 0.75 && tierRace.length > 0)
                {
                    tier = randomItem(tierRace);
                }
                else
                {
                    tier = randomItem(tierGeneric);
                }
            }
            catch {}

            if(tier == '')
            {
                if(Math.random() < 0.65 && tierRace.length > 0)
                {
                    tier = randomItem(tierRace);
                }
                else
                {
                    tier = randomItem(tierGeneric);
                }
            }

            let name = '';
            // Weighted choice between random construction sets or pre-made sets
            name = randomItem(data[race]);
            if(name.includes('random-'))
            {
                // Exclude all other races and subraces from subgeneration
                let excludes = [];
                const options = Array.from(document.getElementById('select1').options).concat(Array.from(document.getElementById('select2').options))
                for(let i = 0; i < options.length; i++)
                {
                    element = options[i].value.toLowerCase();
                    excludes.push(element + '-');
                    excludes.push('-' + element);
                }
                excludes = excludes.filter(item => ![race + '-', '-' + race].includes(item));
                const randomParameters = name.split('-');
                name = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3], excludes);
            }
            return  tier + ' of ' + name;

        case 'settlements':
            generatedName = randomItem(data[race]);
            
            if(generatedName.includes('random-'))
            {
                // Exclude all other races from subgeneration
                const randomParameters = generatedName.split('-');
                let excludes = [];
                const options = Array.from(document.getElementById('select1').options).concat(Array.from(document.getElementById('select2').options))
                for(let i = 0; i < options.length; i++)
                    {
                        element = options[i].value.toLowerCase();
                        excludes.push(element + '-');
                        excludes.push('-' + element);
                    }
                excludes = excludes.filter(item => ![race + '-', '-' + race].includes(item));

                if(generatedName.includes('nature'))
                {

                    generatedName = generateSimple(root, randomParameters[1], randomParameters[2], excludes);
                }
                else
                {
                    generatedName = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3], excludes);
                }
            }
            
            let descriptor = randomItem(data['size'][size]);
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
            let alwaysAddEnding = false;
            if(Math.random() < 0.3)
            {
                prefix = randomItem(data['prefix']);
                if(prefix.includes('random-'))
                {
                    alwaysAddEnding = true;
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
                const noun = randomItem(['animals', 'objects', 'people', 'flowers'])
                let descriptors = ['quantity', 'colors', 'materials'];
                if(noun != 'objects' && noun != 'flowers')
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
            if(Math.random() < 0.55 || alwaysAddEnding)
            {
                generatedName += ' ' + randomItem(data['suffix'])
            }
            return generatedName;
    }
}

// Handles fantasy organization generation
function generateFantasyOrg(root, subfolder, list, select1)
{
    const data = getNamelist(root, subfolder, list);
    let generatedName = '';
    select1 = select1.toLowerCase();
    switch(list)
    {
        case 'guilds':
            return randomItem(data[select1]) + ' ' + randomItem(data.suffix);
        case 'gangs':
            return generateSimple(root, subfolder, list);
        case 'orders':
            if(Math.random() < 0.5)
            {
                return randomItem(data[select1]) + ' ' + randomItem(data.prefix) + ' ' + randomItem(data.name);
            }
            else
            {
                return randomItem(data.name) + ' ' + randomItem(data[select1]) + ' ' + randomItem(data.suffix);
            }
        case 'magicacademy':
            if(Math.random() < 0.5)
            {
                prefix = randomItem(data.prefix['preset']);
            }
            else
            {
                prefix = randomItem(data.prefix['random']);
                let randomParameters = prefix.split('-');
                if(prefix.includes('nature'))
                {
                    prefix = generateSimple(root, randomParameters[1], randomParameters[2]);
                }
                else if(prefix.includes('realms'))
                {
                    prefix = generateFantasyLocation(root, subfolder, list, race, size)
                }
                else // Surname founder case
                {
                    prefix = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3]);
                    if(Math.random() < 0.2) // Saint xyz University
                    {
                        prefix = 'Saint ' + prefix;
                    }
                }
            }

            generatedName += prefix;
            if(Math.random() < 0.25)
            {
                let optPrefix = randomItem(data['adjective']);
                generatedName += ' ' + optPrefix;
            }
            generatedName += ' ' + randomItem(data['type']);
            if(Math.random() < 0.5)
            {
                generatedName += ' ' + randomItem(data['suffix']);
            }
            return generatedName;
    }
}

// Handles deity generation
function generateFantasyDeity(root, subfolder, aspect=null, alignment=null, title=true, domain1=null, domain2=null,)
{
    const data = getNamelist(root, subfolder, 'deities');
    let generatedName = '';
    aspect = aspect.toLowerCase();
    alignment = alignment.toLowerCase();
    if(aspect == 'indeterminate')
    {
        generatedName = randomItem(data.indeterminate.neutral.concat(data.indeterminate[alignment]));
    }
    else
    {
        generatedName = randomItem(data[aspect]);
    }
    if(domain1)
    {
        domain1 = domain1.replaceAll('/', '').toLowerCase();
    }
    if(domain2)
    {
        domain2 = domain2.replaceAll('/', '').toLowerCase();
    }

    if(title && ( domain1 != null || domain2 != null))
    {
        if(domain1 != null)
        {
            let domain1List = [];
            if(data[domain1][alignment] != undefined)
            {
                domain1List = data[domain1][alignment];
                if(alignment != 'neutral')
                {
                    domain1List = data[domain1][alignment].concat(data[domain1]['neutral']);
                }
            }
            else
            {
                domain1List = data[domain1];
            }
            domain1 = randomItem(domain1List)
            generatedName += ', ' + randomItem(data.titles[aspect]) + ' of ' + domain1;
        }
        if(domain2 != null)
        {
            let domain2List = [];
            if(data[domain2][alignment] != undefined)
            {
                domain2List = data[domain2][alignment];
                if(alignment != 'neutral')
                {
                    domain2List = data[domain2][alignment].concat(data[domain2]['neutral']);
                }
            }
            else
            {
                domain2List = data[domain2];
            }
            if(domain1 == null)
            {
                generatedName += ', ' + randomItem(data.titles[aspect]) + ' of ' + randomItem(domain2List);  
            }
            else
            {
                domain2 = randomItem(domain2List);
                // no duplicates allowed
                while(domain1 == domain2)
                {
                    domain2 = randomItem(domain2List);
                }
                generatedName += ' and ' + domain2;
            }
        }
    }
    return generatedName;
}