// Handles Sci-Fi spacecraft generation
function generateSciFiSpacecraft(root, subfolder, type, size, usePrefix)
{
    let generatedName = '';
    const data = getNamelist(root, subfolder, 'ships');
    if(size == 'Station')
    {
        generatedName = randomItem(getNamelist(root, subfolder, 'stations')[type.toLowerCase()]);
    }
    else if(size == 'Capital')
    {
        generatedName = randomItem(data[type.toLowerCase() + size.toLowerCase()].concat(data[type.toLowerCase() + 'shared']));
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