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

function generateSciFiPlanet(root, subfolder, climate, colonists)
{
    colonists = colonists.toLowerCase();
    climate = climate.replaceAll(' ', '').toLowerCase();
    return randomItem(getNamelist(root, subfolder, colonists)[climate]);
}