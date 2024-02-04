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
function getNamelist(namelist)
{
    let file;
    switch(namelist)
    {
        // Human Lists
        case 'Western':
            file = 'assets/namelists/fantasy/human/western.json';
            break;
        case 'Eastern':
            file = 'assets/namelists/fantasy/human/eastern.json';
            break;
        case 'Northern':
            file = 'assets/namelists/fantasy/human/northern.json';
            break;
        
        // Elf Lists
        case 'High Elf':
            file = 'assets/namelists/fantasy/elf/highElf.json';
            break;
        case 'Wood Elf':
            file = 'assets/namelists/fantasy/elf/woodElf.json';
            break;
        case 'Dark Elf':
            file = 'assets/namelists/fantasy/elf/darkElf.json';
            break;
        case 'Drow':
            file = 'assets/namelists/fantasy/elf/drow.json';
            break;
        
        // Dwarf Lists
        case 'Dwarf':
            file = 'assets/namelists/fantasy/dwarf/dwarf.json';
            break;
            
        // Halfling Lists
        case 'Halfling':
            file = 'assets/namelists/fantasy/halfling/halfling.json';
            break;
            
        // Tiefling Lists
        case 'Infernal':
            file = 'assets/namelists/fantasy/tiefling/infernal.json';
            break;
        case 'Virtue':
            file = 'assets/namelists/fantasy/tiefling/virtue.json';
            break;
            
        // Orc Lists
        case 'Orc':
            file = 'assets/namelists/fantasy/orc/orc.json';
            break;
        
        // Epithet Lists
        case 'Suffixes':
            file = 'assets/namelists/fantasy/shared/epithets/suffixes.json';
            break;
        case 'Nicknames':
            file = 'assets/namelists/fantasy/shared/epithets/nicknames.json';
            break;
        case 'Animals':
            file = 'assets/namelists/fantasy/shared/epithets/animals.json';
            break;
        case 'Sobriquets':
            file = 'assets/namelists/fantasy/shared/epithets/sobriquets.json';
            break;
            
        // Title Lists
        case 'Nobility':
            file = 'assets/namelists/fantasy/shared/titles/noble.json';
            break;
        case 'Military':
            file = 'assets/namelists/fantasy/shared/titles/military.json';
            break;
        case 'Religious':
            file = 'assets/namelists/fantasy/shared/titles/religious.json';
            break;
        case 'Occupation':
            file = 'assets/namelists/fantasy/shared/titles/occupation.json';
            break;
    }

    return getJson(file);
}

// Creates a name
function generateName(namelist=null, gender=null, surname=false, epithet=null, title=null)
{
    let generatedName = '';

    // Picks a title
    if(title)
    {
        data = getNamelist(title);
        let combined = [];
        let male = data['male'];
        let fem = data['female'];
        let neu = data['neutral'];

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
        data = getNamelist(namelist);
        let male = data['male'];
        let fem = data['female'];
        let neu = data['neutral'];
        let sur = data['surname'];

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
        data = getNamelist(epithet);
        let male = data['male'];
        let fem = data['female'];
        let neu = data['neutral'];

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

// On button press, take attributes and generate
function executeGenerator()
{
    let race = document.getElementById("subraceselect").value;
    let gender = document.getElementById("genderselect").value;
    let surname = document.getElementById("surname").checked;
    let title = document.getElementById("titleselect").value;
    let nick = document.getElementById("nickselect").value;

    if(title == "None")
    {
        title = null;
    }

    if(nick == "None")
    {
        nick = null;
    }

    if(race == "Virtue") // genderless and no surnames
    {
        gender = "Neutral";
        surname = false;
    }

    document.getElementById("nameoutput").textContent = '';
    for(let i = 0; i < 10; i++)
    {
        document.getElementById("nameoutput").textContent += generateName(race, gender, surname, nick, title) + "\n";
    }
}