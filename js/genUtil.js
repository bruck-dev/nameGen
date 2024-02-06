// Handles simple prefix/suffix creation
function generateSimple(genre, namelist)
{
    const data = getNamelist(genre, namelist)
    return randomItem(data['prefix']) + ' ' + randomItem(data['suffix']);
}