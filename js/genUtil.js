// Handles simple prefix/suffix creation
function generateSimple(root, subfolder, namelist)
{
    const data = getNamelist(root, subfolder, namelist);

    let prefix = randomItem(data['prefix']);

    // If the prefix select contains the random- parameter, split it up to find the namelist and key to pull from.
    if(prefix.includes('random-'))
    {
        let randomParameters = prefix.split('-');
        prefix = getRandomName(root, randomParameters[1], randomParameters[2], randomParameters[3]);
    }

    const suffix = randomItem(data['suffix']);
    return prefix + ' ' + suffix;
}

// Get a random element from the given list and key
function getRandomName(root, subfolder, list, key)
{
    word = randomItem(getNamelist(root, subfolder, list)[key]);
    return word.charAt(0).toUpperCase() + word.slice(1); // Capitalizes the first letter just in case 
}