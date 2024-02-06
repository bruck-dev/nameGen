// Handles fantasy name generation
function generateFantasyName(namelist=null, gender=null, surname=false, title=null, epithet=null)
{
    let generatedName = '';
    const genre = 'fantasy';
    genType = localStorage.getItem('genType'); // gets base race

    // Special conditions
    if(namelist == "Virtue") // genderless and no surnames, ignore inputs
    {
        gender = "Neutral";
        surname = false;
    }
    
    // Picks a title
    if(title)
    {
        const data = getNamelist(genre, title);
        let titleChoices = [];
        try
        {
            // Check for race-specific titles
            titleChoices = data[genType + gender.toLowerCase()].concat(data[genType + 'neutral']);
        }
        catch(error) 
        {
            // If none, ignore the missing key error and use the shared list as expected
        }

        titleChoices = titleChoices.concat(data[gender.toLowerCase()].concat(data['neutral']));
        generatedName += randomItem(titleChoices) + ' ';
    }

    // Picks a given name and surname if enabled
    if(namelist)
    {
        const data = getNamelist(genre, namelist);
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
        const data = getNamelist(genre, epithet);
        const nick = data[gender.toLowerCase()].concat(data['neutral']);
        generatedName += ' ' + randomItem(nick);
    }

    return generatedName;
}

// Handles fantasy uniques
function generateFantasyUnq(genType)
{
    let genre = 'fantasy';
    generatedName = '';

    switch(genType)
    {
        case 'magic-academy':
            const optPrefixChance = Math.random() < 0.25;
            const optSuffixChance = Math.random() < 0.5;
            const data = getNamelist(genre, genType);

            let prefix = randomItem(data['prefix']);

            // Check if prefix includes random sublist selectors
            if(prefix.includes('random-'))
            {
                if(prefix.includes('nature'))
                {
                    prefix = generateSimple('fantasy', prefix.slice(14));
                }
                else
                {
                    const founder = getNamelist(genre, prefix.slice(7));
                    prefix = randomItem(founder['surname']);
                    prefix = prefix.charAt(0).toUpperCase() + prefix.slice(1); // Capitalizes the first letter just in case
                }
            }
            generatedName += prefix;
            if(optPrefixChance)
            {
                let optPrefix = randomItem(data['optionalprefix']);
                generatedName += ' ' + optPrefix;
            }
            generatedName += ' ' + randomItem(data['type']);
            if(optSuffixChance)
            {
                generatedName += ' ' + randomItem(data['optionalsuffix']);
            }
            break;
    }
    return generatedName;
}

// Handles fantasy location generation
function generateFantasyLocation(race, size, genType)
{
    const data = getNamelist('fantasy', genType);
    switch(genType)
    {
        case 'realm':
            return randomItem(data[(race + size).toLowerCase()]) + ' of ' + randomItem(data[race.toLowerCase()]);
        case 'settlement':
            let generatedName = randomItem(data[race.toLowerCase()]);
            let descriptor = randomItem(data[size.toLowerCase()]);

            // Plural descriptors must go at the end
            if(descriptor.slice(-1) == 's')
            {
                generatedName += ' ' + descriptor;
            }
            // Descriptors with 'of' should not appear after
            else if(descriptor.includes(' of'))
            {
                generatedName = descriptor + ' ' + generatedName;
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
function generateFantasyOrg(opt1, genType)
{
    const data = getNamelist('fantasy', genType);
    switch(genType)
    {
        case 'guild':
            return randomItem(data[opt1.toLowerCase()]) + ' ' + randomItem(data['suffix']);
    }
}