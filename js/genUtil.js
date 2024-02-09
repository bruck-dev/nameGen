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

    let data = getNamelist(root, subfolder, list)[key];

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

function pluralizeNoun(word)
{
    wordLower = word.toLowerCase();
    const irregular = [
        "goose:geese",
        "tooth:teeth",
        "child:children",
        "person:people",
        "samurai:samurai",
        "ronin:ronin"
    ];
    const uncountable = [
        "sheep",
        "fish",
        "deer",
        "moose",
        "rice",
        "shrimp",
        "salmon",
        "pike",
        "swine",
        "trout",
        "bison",
        "tuna",
        "fey"
    ];

    // Check if uncountable constant
    if(uncountable.includes(wordLower))
    {
        return word;
    }

    // Check if in irregular
    for(let i = 0; i < irregular.length; i++)
    {
        if(irregular[i].includes(wordLower))
        {
            const split = irregular[i].split(':');
            if(isLowerCase(word))
            {
                return split[1];
            }
            else
            {
                return split[1].charAt(0).toUpperCase() + split[1].slice(1);
            }
        }
    }

    // Otherwise, construct it
    if(wordLower.endsWith('man'))
    {
        return word.slice(0, -3) + 'men';
    }
    else if(wordLower.endsWith('ox'))
    {
        return word + 'en';
    }
    else if(wordLower.endsWith('ouse') && (wordLower.charAt(0) == 'm' || wordLower.charAt(0) == 'l'))
    {
        return word.slice(0, -4) + 'ouse';
    }
    else if(wordLower.endsWith('ex') || wordLower.endsWith('ix'))
    {
        return word.slice(0, -2) + 'ices';
    }
    else if(wordLower.endsWith('x') || wordLower.endsWith('ch') || wordLower.endsWith('ss') || wordLower.endsWith('sh'))
    {
        return word + 'es'
    }
    else if(wordLower.endsWith('f'))
    {
        return word.slice(0, -1) + 'ves';
    }
    else if(wordLower.endsWith('o'))
    {
        return word + 'es';
    }
    else if(wordLower.endsWith('y') && !wordLower.endsWith('ey'))
    {
        return word.slice(0, -1) + 'ies';
    }
    else if(wordLower.endsWith('s'))
    {
        return word + 'es';
    }
    else
    {
        return word + 's';
    }
}

function isLowerCase(str)
{
    return (str == str.toLowerCase() && str != str.toUpperCase());
}