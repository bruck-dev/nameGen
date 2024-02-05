/**
 * @summary Generator Functions File
 * @description Contains all JS functions used on the web app to generate the names; essentially identical the Python desktop app ones.
 * @author bruck
 * 
 * @version  0.1.A
 */

// Gets the data from a given JSON file
function getJson(file)
{
    let request = new XMLHttpRequest();
    request.open('GET', file, false);
    request.send(null);
    return JSON.parse(request.responseText);
}

// Picks a random item from the passed list
function randomItem(items)
{
    return items[Math.floor(Math.random()*items.length)];
}

// Finds the necessary JSON file and returns its data
function getNamelist(genre, namelist)
{
    let file;
    namelist = namelist.replaceAll(' ', '').toLowerCase();
    switch(genre)
    {
        /* FANTASY LISTS */
        case 'fantasy':
            switch(namelist)
            {
                // Human Lists
                case 'western':
                    file = 'assets/namelists/fantasy/human/western.json';
                    break;
                case 'eastern':
                    file = 'assets/namelists/fantasy/human/eastern.json';
                    break;
                case 'northern':
                    file = 'assets/namelists/fantasy/human/northern.json';
                    break;
                
                // Elf Lists
                case 'highelf':
                    file = 'assets/namelists/fantasy/elf/highElf.json';
                    break;
                case 'woodelf':
                    file = 'assets/namelists/fantasy/elf/woodElf.json';
                    break;
                case 'darkelf':
                    file = 'assets/namelists/fantasy/elf/darkElf.json';
                    break;
                case 'drow':
                    file = 'assets/namelists/fantasy/elf/drow.json';
                    break;
                
                // Dwarf Lists
                case 'dwarf':
                    file = 'assets/namelists/fantasy/dwarf/dwarf.json';
                    break;
                    
                // Halfling Lists
                case 'halfling':
                    file = 'assets/namelists/fantasy/halfling/halfling.json';
                    break;
                    
                // Tiefling Lists
                case 'infernal':
                    file = 'assets/namelists/fantasy/tiefling/infernal.json';
                    break;
                case 'virtue':
                    file = 'assets/namelists/fantasy/tiefling/virtue.json';
                    break;
                    
                // Orc Lists
                case 'orc':
                    file = 'assets/namelists/fantasy/orc/orc.json';
                    break;
                
                // Epithet Lists
                case 'suffixes':
                    file = 'assets/namelists/fantasy/shared/epithets/suffixes.json';
                    break;
                case 'nicknames':
                    file = 'assets/namelists/fantasy/shared/epithets/nicknames.json';
                    break;
                case 'animals':
                    file = 'assets/namelists/fantasy/shared/epithets/animals.json';
                    break;
                case 'sobriquets':
                    file = 'assets/namelists/fantasy/shared/epithets/sobriquets.json';
                    break;
                    
                // Title Lists
                case 'nobility':
                    file = 'assets/namelists/fantasy/shared/titles/noble.json';
                    break;
                case 'military':
                    file = 'assets/namelists/fantasy/shared/titles/military.json';
                    break;
                case 'religious':
                    file = 'assets/namelists/fantasy/shared/titles/religious.json';
                    break;
                case 'occupation':
                    file = 'assets/namelists/fantasy/shared/titles/occupation.json';
                    break;

                // Location Lists
                case 'realm':
                    file = 'assets/namelists/fantasy/locations/kingdoms.json';
                    break;
                case 'settlement':
                    file = 'assets/namelists/fantasy/locations/settlements.json';
                    break;

                // Nature Lists
                case 'arctic':
                    file = 'assets/namelists/fantasy/nature/arctic.json';
                    break;
                case 'arid':
                    file = 'assets/namelists/fantasy/nature/arid.json';
                    break;
                case 'freshwater':
                    file = 'assets/namelists/fantasy/nature/freshwater.json';
                    break;
                case 'rocky':
                    file = 'assets/namelists/fantasy/nature/rocky.json';
                    break;
                case 'saltwater':
                    file = 'assets/namelists/fantasy/nature/saltwater.json';
                    break;
                case 'swampy':
                    file = 'assets/namelists/fantasy/nature/swampy.json';
                    break;
                case 'temperate':
                    file = 'assets/namelists/fantasy/nature/temperate.json';
                    break;

                // Organization Lists
                case 'magic-academy':
                    file = 'assets/namelists/fantasy/organizations/magicacademy.json'
                    break;
                case 'guild':
                    file = 'assets/namelists/fantasy/organizations/guild.json'
                    break;
            }
        break;
    }

    return getJson(file);
}

// Creates requested output for generator
function generateOutput(configType, opt1=null, opt2=null, opt3=false, opt4=null, opt5=null)
{
    let generatedOutput = '';
    const genType = localStorage.getItem('genType');

    switch(configType)
    {
        case 'f-race':
            generatedOutput = generateFantasyName(opt1, opt2, opt3, opt4, opt5);
            break;
        case 'f-unq':
            generatedOutput = generateFantasyUnq(genType);
            break;
        case 'f-nat':
            generatedOutput = generateSimple('fantasy', opt1.toLowerCase());
            break;
        case 'f-loc':
            generatedOutput = generateFantasyLocation(opt1, opt2, genType);
            break;
        case 'f-org':
            generatedOutput = generateFantasyOrg(opt1, genType);
    }
    return generatedOutput;
}

// On button press, take attributes and generate
function executeGenerator()
{
    let opt1 = document.getElementById("opt1select").value;
    let opt2 = document.getElementById("opt2select").value;
    let opt3 = document.getElementById("opt3check").checked;
    let opt4 = document.getElementById("opt4select").value;
    let opt5 = document.getElementById("opt5select").value;
    let quantity = document.getElementById("quantity").value;

    // Set a hard limit to 999 and a floor of 1. Ceiling is arbitrary.
    if(quantity > 999)
    {
        quantity = 999;
        document.getElementById("quantity").value = 999;
    }
    else if(quantity < 1)
    {
        quantity = 1;
        document.getElementById("quantity").value = 1;
    }

    // Set select values to ignore if no list is selected
    if(opt1 == "None")
    {
        opt1 = null;
    }
    if(opt2 == "None")
    {
        opt2 = null;
    }
    if(opt4 == "None")
    {
        opt4 = null;
    }
    if(opt5 == "None")
    {
        opt5 = null;
    }

    document.getElementById("nameoutput").textContent = '';
    for(let i = 0; i < quantity; i++)
    {
        document.getElementById("nameoutput").textContent += generateOutput(localStorage.getItem("configType"), opt1, opt2, opt3, opt4, opt5) + "\n";
    }
}

// Handles fantasy name generation
function generateFantasyName(namelist=null, gender=null, surname=false, title=null, epithet=null)
{
    let generatedName = '';
    const genre = 'fantasy';

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
        let combined = [];
        const male = data['male'];
        const fem = data['female'];
        const neu = data['neutral'];

        switch(gender)
        {
            case 'Male':
                combined = male.concat(neu);
                generatedName += randomItem(combined) + ' ';
                break;
            case 'Female':
                combined = fem.concat(neu);
                generatedName += randomItem(combined) + ' ';
                break;
            case 'Neutral':
                generatedName += randomItem(neu) + ' ';
                break;
        }
    }

    // Picks a given name and surname if enabled
    if(namelist)
    {
        const data = getNamelist(genre, namelist);
        const male = data['male'];
        const fem = data['female'];
        const neu = data['neutral'];
        const sur = data['surname'];

        switch(gender)
        {
            case 'Male':
                generatedName += randomItem(male);
                if(surname)
                {
                    generatedName += ' ' + randomItem(sur);
                }
                break;
            case 'Female':
                generatedName += randomItem(fem);
                if(surname)
                {
                    let pickedSur = randomItem(sur);
                    if(namelist == 'Northern') // Nordic and Slavic names used to be patronymic, so this adds the 'daughter of' variant. Keeps the leading 's' for possessive.
                    {
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
                    } 
                    generatedName += ' ' + pickedSur;
                }
                break;
            case 'Neutral':
                generatedName += randomItem(neu);
                if(surname)
                {
                    generatedName += randomItem(sur);
                }
                break;
        }
    }

    // Picks an epithet if enabled
    if(epithet)
    {
        const data = getNamelist(genre, epithet);
        const male = data['male'];
        const fem = data['female'];
        const neu = data['neutral'];

        switch(gender)
        {
            case 'Male':
                combined = male.concat(neu);
                generatedName += ' ' + randomItem(combined);
                break;
            case 'Female':
                combined = fem.concat(neu);
                generatedName += ' ' + randomItem(combined);
                break;
            case 'Neutral':
                generatedName += ' ' + randomItem(combined);
                break;
        }
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

// Handles simple prefix/suffix creation
function generateSimple(genre, namelist)
{
    const data = getNamelist(genre, namelist)
    return randomItem(data['prefix']) + ' ' + randomItem(data['suffix']);
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