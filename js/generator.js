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
                case 'magical':
                    file = 'assets/namelists/fantasy/shared/titles/magic.json';
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
    
    // Generates names given quantity, regenerates duplicates (decreasingly likelihood as more options are enabled)
    let i = 0;
    while(i < quantity)
    {
        let genName = generateOutput(localStorage.getItem("configType"), opt1, opt2, opt3, opt4, opt5);
        if(!(document.getElementById("nameoutput").textContent.includes(genName)))
        {
            document.getElementById("nameoutput").textContent += genName + "\n";
            i++;
        }
    }
}