// Handles Sci-Fi spacecraft generation
function generateSciFiSpacecraft(root, subfolder, type, shipclass, usePrefix)
{
    let generatedName = '';
    const data = getNamelist(root, subfolder, 'ships');
    if(shipclass == 'Station')
    {
        generatedName = randomItem(getNamelist(root, subfolder, 'stations')[type.toLowerCase()]);
    }
    else if(shipclass != 'Standard')
    {
        generatedName = randomItem(data[type.toLowerCase() + shipclass.toLowerCase()].concat(data[type.toLowerCase() + 'shared']));
    }
    else
    {
        generatedName = randomItem(data[type.toLowerCase() + 'shared']);
    }

    if(usePrefix)
    {
        return randomItem(getNamelist(root, subfolder, 'shared')['prefix']) + ' ' + generatedName;
    }
    else
    {
        return generatedName;
    }
}

// Handles Sci-Fi planet generation
function generateSciFiPlanet(root, subfolder, climate, style)
{
    style = style.replaceAll(' ', '').toLowerCase();
    climate = climate.replaceAll(' ', '').toLowerCase();
    const data = getNamelist(root, subfolder, style);
    let name = randomItem(data[climate].concat(data['generic']));

    if(name.includes('random-'))
    {
        randomParameters = name.split('-');
        name = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3]);
    }

    if(!(name.indexOf(' ') > -1))
    {
        if(Math.random() < 0.2)
        {
            name += ' ' + randomItem(getNamelist(root, subfolder, 'shared')['suffix']);
        }
    }
    return name;
}

function generateSciFiOrg(root, subfolder, list, opt1, opt2)
{
    switch(list)
    {
        case 'corporations':
            let generatedName = '';
            opt1 = opt1.toLowerCase();
            opt2 = opt2.toLowerCase();
        
            const adjChance = Math.random();
            const data = getNamelist(root, subfolder, 'corporations');
            let adjList = data['adjgeneric'];
            let prefixList = data[opt2];
            let suffixList = data['sufgeneric'];
        
            // Add industry-specific stuff, weighted x2
            if(opt1 != 'generic')
            {
                adjList = adjList.concat(data['adj' + opt1]).concat(data['adj' + opt1]);
                suffixList = suffixList.concat(data['suf' + opt1]).concat(data['suf' + opt1]);
            }

            if(opt2 == 'acronym')
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
        generatedName +=  firstName + ' '

        if(surname)
        {
            let surname = randomItem(data['surname']);
            if(surname.includes('random-'))
            {
                randomParameters = surname.split('-');
                surname = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3]);
            }
            generatedName += surname;
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