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

// Pluralizes the passed noun
function pluralizeNoun(word)
{
    wordLower = word.toLowerCase();
    const irregular = [
        "goose:geese",
        "tooth:teeth",
        "child:children",
        "person:people",
        "samurai:samurai",
        "ronin:ronin",
        "mouse:mice"
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

// Checks if string is all lowercase
function isLowerCase(str)
{
    return (str == str.toLowerCase() && str != str.toUpperCase());
}

// Generates a random integer in the given range inclusive
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Finds the necessary JSON file and returns its data
function getNamelist(root, subfolder, namelist)
{
    namelist = namelist.replaceAll(' ','').toLowerCase();
    path = 'assets/namelists/' + root + '/' + subfolder + '/' + namelist + '.json';
    return getJson(path);
}