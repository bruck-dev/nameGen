/**
 * @summary Generator Functions File
 * @description Contains all JS functions used on the web app to generate the names; essentially identical the Python desktop app ones.
 * @author bruck
 * 
 * @version  0.1.A
 */

// Creates requested output for generator based on necessary generator function
function generateOutput(select1=null, select2=null, checkbox1=false, select4=null, select5=null)
{
    let generatedOutput = '';
    const root = localStorage.getItem('root');
    const subfolder = localStorage.getItem('subfolder');
    const list = localStorage.getItem('list');

    switch(root)
    {
        case 'fantasy':
            if(subfolder.includes('races'))
            {
                generatedOutput = generateFantasyName(root, subfolder, select1, select2, checkbox1, select4, select5);
            }
            else if(subfolder.includes('location'))
            {
                generatedOutput = generateFantasyLocation(root, subfolder, list, select1, select2, select4);
            }
            else if(subfolder.includes('nature'))
            {
                generatedOutput = generateSimple(root, subfolder, select1.toLowerCase());
            }
            else if(subfolder.includes('organizations'))
            {
                generatedOutput = generateFantasyOrg(root, subfolder, list, select1);
            }
            else if(subfolder.includes('creatures') && list.includes('deities'))
            {
                generatedOutput = generateFantasyDeity(root, subfolder, select1, select2, checkbox1, select4, select5);
            }
        break;

        case 'scifi':
            if(list.includes('spacecraft'))
            {
                generatedOutput = generateSciFiSpacecraft(root, subfolder + '/' + list, select1, select2, checkbox1);
            }
            if(list.includes('planets'))
            {
                generatedOutput = generateSciFiPlanet(root, subfolder + '/' + list, select1, select2);
            }
            if(subfolder.includes('organizations'))
            {
                generatedOutput = generateSciFiOrg(root, subfolder, list, select1, select2);
            }
            if(subfolder.includes('masseffect') && list.includes('races'))
            {
                generatedOutput = generateSciFiName(root, subfolder, select1, select2, checkbox1, select4);
            }
        break;
    }
    return generatedOutput;
}

// On button press, take attributes and generate
function executeGenerator()
{
    let select1 = document.getElementById("select1").value;
    let select2 = document.getElementById("select2").value;
    let checkbox1 = document.getElementById("checkbox1").checked;
    let select4 = document.getElementById("select4").value;
    let select5 = document.getElementById("select5").value;
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
    if(select1 == "None")
    {
        select1 = null;
    }
    if(select2 == "None")
    {
        select2 = null;
    }
    if(select4 == "None")
    {
        select4 = null;
    }
    if(select5 == "None")
    {
        select5 = null;
    }

    document.getElementById("nameoutput").textContent = '';
    
    // Generates names given quantity, regenerates duplicates (decreasingly likelihood as more options are enabled)
    for(let i = 0; i < quantity; i++)
    {
        let genName = generateOutput(select1, select2, checkbox1, select4, select5);
        document.getElementById("nameoutput").textContent += genName + "\n";
    }
}

// Handles simple prefix/suffix creation
function generateSimple(root, subfolder, namelist, excludes=null)
{
    const data = getNamelist(root, subfolder, namelist);
    let prefix = randomItem(data['prefix']);

    // If the prefix select contains the random- parameter, split it up to find the namelist and key to pull from. Keep pulling until its not random- anymore.
    if(prefix.includes('random-'))
    {
        let randomParameters = prefix.split('-');
        prefix = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3], excludes);
    }

    const suffix = randomItem(data['suffix']);
    return prefix + ' ' + suffix;
}

// Get a random element from the given list and key
function getRandomName(root, subfolder, list, key, excludes=null)
{
    if(key == undefined) // Probably called upwards FROM a sublist into one that has a full generation function.
    {
        return generateSimple(root, subfolder, list, excludes);
    }

    // Check if key is a dict/has a desired subkey
    let data = []
    if(key.indexOf('.') != -1)
    {
        keyPath = key.split('.')
        data = getNamelist(root, subfolder, list)[keyPath[0]][keyPath[1]];
    }
    else
    {
        data = getNamelist(root, subfolder, list)[key];
    }

    // Filters out any values that contain excluded strings from the list
    if(excludes)
    {
        excludes.forEach(element => {
            data = data.filter(s => !s.includes(element));
        });
    }

    word = randomItem(data);
    if(word.includes('random-'))
    {
        let randomParameters = [];
        do
        {
            randomParameters = word.split('-');
            word = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3], excludes);
        }
        while(word.includes('Random-')) // returned capitalized
    }
    return word.charAt(0).toUpperCase() + word.slice(1); // Capitalizes the first letter just in case
}