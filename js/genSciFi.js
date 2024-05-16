// Handles Sci-Fi spacecraft generation
function generateSciFiSpacecraft(root, subfolder, faction, shipclass, usePrefix)
{
    faction = faction.toLowerCase();
    shipclass = shipclass.replaceAll(' ', '').toLowerCase();
    const data = getNamelist(root, subfolder, faction);

    let generatedName = randomItem(data[shipclass]);
    if(generatedName.includes('random-'))
    {
        randomParameters = generatedName.split('-');
        generatedName = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3]);
    }

    if(usePrefix)
    {
        generatedName = randomItem(data['prefix']) + ' ' + generatedName;
    }
    return generatedName;
}

// Handles Sci-Fi planet generation
function generateSciFiPlanet(root, subfolder, climate, style)
{
    style = style.replaceAll(' ', '').toLowerCase();
    climate = climate.replaceAll(' ', '').toLowerCase();
    const data = getNamelist(root, subfolder, style);

    let names = data[climate];
    if(climate != 'uninhabitable' && climate != 'paradisal')
    {
        names = names.concat(data['generic']);
    }
    let name = randomItem(names)

    if(name.includes('random-'))
    {
        randomParameters = name.split('-');
        name = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3]);
    }

    if(name.indexOf(' ') == -1)
    {
        const modifier = Math.random();
        // Acheron IV
        if(modifier < 0.15)
        {
            name += ' ' + randomItem(getNamelist(root, subfolder, 'shared')['suffix']);
        }
        // 47 Acheron
        else if(modifier < 0.25)
        {
            name = '' + getRandomInt(1, 400) + ' ' + name;
        }
    }
    return name;
}

function generateSciFiOrg(root, subfolder, list, select1, select2)
{
    switch(list)
    {
        case 'corporations':
            let generatedName = '';
            select1 = select1.toLowerCase();
            select2 = select2.toLowerCase();
        
            const adjChance = Math.random();
            const data = getNamelist(root, subfolder, 'corporations');
            let adjList = data['adjgeneric'];
            let prefixList = data[select2];
            let suffixList = data['sufgeneric'];
        
            // Add industry-specific stuff, weighted x2
            if(select1 != 'generic')
            {
                adjList = adjList.concat(data['adj' + select1]).concat(data['adj' + select1]);
                suffixList = suffixList.concat(data['suf' + select1]).concat(data['suf' + select1]);
            }

            if(select2 == 'acronym')
            {
                const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                let acronymLength = Math.random() * (4 - 1) + 1; // Random size between 2 and 4

                while (generatedName.length < acronymLength) {
                    generatedName += alphabet[Math.floor(Math.random() * alphabet.length)];
                }
                generatedName += ' ';
            }
            else
            {
                const prefix = randomItem(prefixList); // TODO: add logic for random tags here
                generatedName = prefix + ' ';
            }

            const adj = randomItem(adjList);
            if(adjChance < 0.45)
            {
                generatedName += adj + ' ';
            }
        
            // Keep generating a suffix until it doesn't match with the adj (i.e., avoid "Engineering Engineering"). Some forced exceptions too, until I think of a better way to check for partial substrings.
            let suffix = randomItem(suffixList);
            while(suffix.includes(adj) || ((suffix.toLowerCase() == 'corporation' || suffix.toLowerCase() == 'incorporated' || suffix.toLowerCase() == 'company') && adj.toLowerCase() == 'corporate'))
            {
                suffix = randomItem(suffixList);
            }

            return generatedName + suffix;
    }
}

// Handles mass effect generation
function generateSciFiName(root, subfolder, namelist=null, gender=null, surname=false, title=null)
{
    let generatedName = '';
    gender = gender.toLowerCase();
    namelist = namelist.replaceAll(' ', '').toLowerCase();

    if(namelist == 'quarian')
    {
        return generatedSciFiNameQuarian(root, subfolder, namelist, gender, surname, title);
    }

    // Picks a given name and surname if enabled
    if(namelist)
    {
        const data = getNamelist(root, subfolder, namelist);
        const names = data[gender];
        let firstName = randomItem(names);
        if(firstName.includes('random-'))
        {
            randomParameters = firstName.split('-');
            firstName = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3]);
        }
        generatedName = firstName;

        if(surname)
        {
            let surname = randomItem(data['surname']);
            if(namelist == 'krogan' || namelist == 'salarian')
            {
                generatedName = surname + ' ' + generatedName;
            }
            else
            {
                if(surname.includes('random-'))
                {
                    randomParameters = surname.split('-');
                    surname = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3]);
                }
                generatedName += ' ' + surname;            
            }
        }
    }

    // Picks a title
    if(title)
    {
        const data = getNamelist(root, subfolder + '/shared/titles', title);
        let raceTitles =[];
        let genericTitles = [];

        // Check for race specific titles
        raceTitles = raceTitles.concat(data[namelist + gender]);
        raceTitles = raceTitles.concat(data[namelist + 'neutral']);

        // Check for generic titles
        genericTitles = genericTitles.concat(data[gender]);
        genericTitles = genericTitles.concat(data['neutral']);

        // Remove any undefined values, i.e. disregarding any namelists that don't exist
        raceTitles = raceTitles.filter(function( element ) {
            return element !== undefined;
        });

        genericTitles = genericTitles.filter(function( element ) {
            return element !== undefined;
        });

        // Pick a random from the lists, weighted. Checks if lists have values first.
        generatedTitle = '';
        const rando = Math.random();
        if(raceTitles.length == 0)
        {
            generatedTitle = randomItem(genericTitles);
        }
        else
        {
            if(rando < 0.3)
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

    return generatedName;
}

// Handles specific quarian stuff because it's harder
function generatedSciFiNameQuarian(root, subfolder, namelist=null, gender=null, surname=false, title=null)
{
    let generatedName = '';
    let data = getNamelist(root, subfolder, namelist);

    generatedName = randomItem(data[gender]) + '\'' + randomItem(data['surname']);

    if(surname)
    {
        generatedName += ' ' + randomItem(data['demonym']) + ' ' + randomItem(data['ship']);
    }

    // Picks a title
    if(title)
    {
        data = getNamelist(root, subfolder + '/shared/titles', title);
        let raceTitles =[];
        let genericTitles = [];

        // Check for race specific titles
        raceTitles = raceTitles.concat(data[namelist + gender]);
        raceTitles = raceTitles.concat(data[namelist + 'neutral']);

        // Check for generic titles
        genericTitles = genericTitles.concat(data[gender]);
        genericTitles = genericTitles.concat(data['neutral']);

        // Remove any undefined values, i.e. disregarding any namelists that don't exist
        raceTitles = raceTitles.filter(function( element ) {
            return element !== undefined;
        });

        genericTitles = genericTitles.filter(function( element ) {
            return element !== undefined;
        });

        // Pick a random from the lists, weighted. Checks if lists have values first.
        generatedTitle = '';
        const rando = Math.random();
        if(raceTitles.length == 0)
        {
            generatedTitle = randomItem(genericTitles);
        }
        else
        {
            if(rando < 0.4)
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

    return generatedName;
}