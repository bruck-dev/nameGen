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

function generateSciFiOrg(root, subfolder, list, opt1, opt2)
{
    switch(list)
    {
        case 'corporations':
            let generatedName = '';
            opt1 = opt1.toLowerCase();
            opt2 = opt2.toLowerCase();
        
            const adjChance = Math.random();
            const data = getNamelist(root, subfolder, 'corporations');
            let adjList = data['adjgeneric'];
            let prefixList = data[opt2];
            let suffixList = data['sufgeneric'];
        
            // Add industry-specific stuff, weighted x2
            if(opt1 != 'generic')
            {
                adjList = adjList.concat(data['adj' + opt1]).concat(data['adj' + opt1]);
                suffixList = suffixList.concat(data['suf' + opt1]).concat(data['suf' + opt1]);
            }

            if(opt2 == 'acronym')
            {
                const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                let acronymLength = Math.random() * (4 - 1) + 1; // Random size between 2 and 4

                while (generatedName.length < acronymLength) {
                    generatedName += alphabet[Math.floor(Math.random() * alphabet.length)];
                }
                generatedName += ' ';
            }
            else
            {
                const prefix = randomItem(prefixList); // TODO: add logic for random tags here
                generatedName = prefix + ' ';
            }

            const adj = randomItem(adjList);
            if(adjChance < 0.45)
            {
                generatedName += adj + ' ';
            }
        
            // Keep generating a suffix until it doesn't match with the adj (i.e., avoid "Engineering Engineering"). Some forced exceptions too, until I think of a better way to check for partial substrings.
            let suffix = randomItem(suffixList);
            while(suffix.includes(adj) || ((suffix.toLowerCase() == 'corporation' || suffix.toLowerCase() == 'incorporated' || suffix.toLowerCase() == 'company') && adj.toLowerCase() == 'corporate'))
            {
                suffix = randomItem(suffixList);
            }

            return generatedName + suffix;
    }
}