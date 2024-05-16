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
function getNamelist(root, subfolder, namelist)
{
    namelist = namelist.replaceAll(' ','').toLowerCase();
    path = 'assets/namelists/' + root + '/' + subfolder + '/' + namelist + '.json';
    return getJson(path);
}

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
            if(subfolder.includes('races/'))
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
            if(subfolder.includes('spacecraft'))
            {
                generatedOutput = generateSciFiSpacecraft(root, subfolder, select1, select2, checkbox1);
            }
            if(subfolder.includes('planets'))
            {
                generatedOutput = generateSciFiPlanet(root, subfolder, select1, select2);
            }
            if(subfolder.includes('organizations'))
            {
                generatedOutput = generateSciFiOrg(root, subfolder, list, select1, select2);
            }
            if(subfolder.includes('masseffect/races'))
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