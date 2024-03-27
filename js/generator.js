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

// Creates requested output for generator
function generateOutput(opt1=null, opt2=null, opt3=false, opt4=null, opt5=null)
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
                generatedOutput = generateFantasyName(root, subfolder, opt1, opt2, opt3, opt4, opt5);
            }
            else if(subfolder.includes('location'))
            {
                generatedOutput = generateFantasyLocation(root, subfolder, list, opt1, opt2);
            }
            else if(subfolder.includes('nature'))
            {
                generatedOutput = generateSimple(root, subfolder, opt1.toLowerCase());
            }
            else if(subfolder.includes('organizations'))
            {
                generatedOutput = generateFantasyOrg(root, subfolder, list, opt1);
            }
        break;

        case 'scifi':
            if(subfolder.includes('spacecraft'))
            {
                generatedOutput = generateSciFiSpacecraft(root, subfolder, opt1, opt2, opt3);
            }
            if(subfolder.includes('planets'))
            {
                generatedOutput = generateSciFiPlanet(root, subfolder, opt1, opt2);
            }
            if(subfolder.includes('organizations'))
            {
                generatedOutput = generateSciFiOrg(root, subfolder, list, opt1, opt2);
            }
            if(subfolder.includes('masseffect'))
            {
                generatedOutput = generateSciFiName(root, subfolder, opt1, opt2, opt3, opt4);
            }
        break;
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
    for(let i = 0; i < quantity; i++)
    {
        let genName = generateOutput(opt1, opt2, opt3, opt4, opt5);
        document.getElementById("nameoutput").textContent += genName + "\n";
    }
}