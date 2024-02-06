// Handles simple prefix/suffix creation
function generateSimple(genre, namelist)
{
    const data = getNamelist(genre, namelist);

    let prefix = randomItem(data['prefix']);

    // If the prefix select contains the random- parameter, split it up to find the namelist and key to pull from.
    if(prefix.includes('random-'))
    {
        prefix = getRandomName(genre, prefix)
    }

    const suffix = randomItem(data['suffix']);
    return prefix + ' ' + suffix;
}

function getRandomName(genre, randomWord)
{
    let randomParameters = [];
    if(randomWord.includes('random-'))
    {
        randomParameters = randomWord.slice(7).split('-');
    }
    else
    {
        randomParameters = randomWord.split('-');
    }
    
    word = randomItem(getNamelist(genre, randomParameters[0])[randomParameters[1]]);
    return word.charAt(0).toUpperCase() + word.slice(1); // Capitalizes the first letter just in case 
}