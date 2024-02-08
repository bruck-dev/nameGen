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
    let data = getNamelist(root, subfolder, list)[key];

    // Filters out any values that contain excluded strings from the list
    if(excludes)
    {
        for(let i = 0; i < excludes.length; i++)
        {
            data = data.filter(s => !s.includes(excludes[i]));
        }
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