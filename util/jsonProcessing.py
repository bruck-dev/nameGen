#!/usr/bin/env python
# coding=utf-8

"""Utility file containing JSON manipulation functions."""
__author__ = "bruck"
__version__ = "1.0.0"
__status__ = "Development"


import shlex
import json
import random

# Find namelist JSON file from passed namelist parameter
def getNamelist(namelist:str):
    match namelist:
        # Human Lists
        case 'Western':
            file = open('assets/namelists/human/western.json', encoding='utf-8')
        case 'Eastern':
            file = open('assets/namelists/human/eastern.json', encoding='utf-8')
        case 'Northern':
            file = open('assets/namelists/human/northern.json', encoding='utf-8')
        
        # Elf Lists
        case 'High Elf':
            file = open('assets/namelists/elf/highElf.json', encoding='utf-8')
        case 'Wood Elf':
            file = open('assets/namelists/elf/woodElf.json', encoding='utf-8')
        case 'Dark Elf':
            file = open('assets/namelists/elf/darkElf.json', encoding='utf-8')
        case 'Drow':
            file = open('assets/namelists/elf/drow.json', encoding='utf-8')
        
        # Dwarf Lists
        case 'Dwarf':
            file = open('assets/namelists/dwarf/dwarf.json', encoding='utf-8')
            
        # Halfling Lists
        case 'Halfling':
            file = open('assets/namelists/halfling/halfling.json', encoding='utf-8')
            
        # Tiefling Lists
        case 'Infernal':
            file = open('assets/namelists/tiefling/infernal.json', encoding='utf-8')
        case 'Virtue':
            file = open('assets/namelists/tiefling/virtue.json', encoding='utf-8')
            
        # Orc Lists
        case 'Orc':
            file = open('assets/namelists/orc/orc.json', encoding='utf-8')
        
        # Epithet Lists
        case 'Suffixes':
            file = open('assets/namelists/shared/epithets/suffixes.json', encoding='utf-8')
        case 'Nicknames':
            file = open('assets/namelists/shared/epithets/nicknames.json', encoding='utf-8')
        case 'Animals':
            file = open('assets/namelists/shared/epithets/animals.json', encoding='utf-8')
        case 'Sobriquets':
            file = open('assets/namelists/shared/epithets/sobriquets.json', encoding='utf-8')
            
        # Title Lists
        case 'Nobility':
            file = open('assets/namelists/shared/titles/noble.json', encoding='utf-8')
        case 'Military':
            file = open('assets/namelists/shared/titles/military.json', encoding='utf-8')
        case 'Religious':
            file = open('assets/namelists/shared/titles/religious.json', encoding='utf-8')
        case 'Occupation':
            file = open('assets/namelists/shared/titles/occupation.json', encoding='utf-8')
    return file

# Names are assembled in order, starting with prefix titles and ending with epithets
def generateNameFromJson(namelist:str, gender:str, surnameEnabled:bool=True, epithetType:str=None, titleType:str=None):
    
    name = ''
    if titleType is not None:
        data = json.load(getNamelist(titleType))
        match gender:
            case 'Male':
                name += random.choice(list(set(data['neutral'] + data['male']))) + ' '
            case 'Female':
                name += random.choice(list(set(data['neutral'] + data ['female']))) + ' '
            case 'Neutral':
                name += random.choice(data['neutral'])+ ' '
                
    data = json.load(getNamelist(namelist))

    match gender:
        case 'Male':
            name += random.choice(data['male'])
        case 'Female':
            name += random.choice(data['female'])
        case 'Neutral':
            name += random.choice(data['neutral'])
            
    if surnameEnabled:
        if data['surname'] and data['surname'][0] != '': # Check if the surname list isn't empty, and isn't disabled by having a blank entry in index 1
            surname = random.choice(data['surname'])
            if namelist == 'Northern' and gender == 'Female': # Nordic and Slavic names used to be patronymic, so this adds the 'daughter of' variant. Keeps the leading 's' for possessive.
                if surname.endswith('ssen') or surname.endswith('sson'):
                    surname = surname[0:-3] + random.choice(['dottir', 'datter', 'dotter'])
                elif surname.endswith('sen') or surname.endswith('son'):
                    surname = surname[0:-2] + random.choice(['dottir', 'datter', 'dotter'])
                elif surname.endswith('ov'):
                    surname = surname[0:-3] + 'a'
            name = name + ' ' + surname
            
    if epithetType is not None:
        data = json.load(getNamelist(epithetType)) # fix this to use different namelists
        match gender:
            case 'Male':
                name += ' ' + random.choice(list(set(data['neutral'] + data['male'])))
            case 'Female':
                name += ' ' + random.choice(list(set(data['neutral'] + data ['female'])))
            case 'Neutral':
                name += ' ' + random.choice(data['neutral'])               
    return name

# Split names into list along spaces, ignoring single quotes
def splitNames(string:str):
    split = shlex.shlex(string)
    split.quotes = '"'
    split.whitespace_split = True
    split.commenters = ''
    return list(split)

# Add passed names to namelist, or replace if told to do so
def addNamesToJson(names:str, namelist:str, type:str, replaceNames:bool=False):

    # Clean up the passed block of names as best as possible
    names = names.replace('\n', ' ')
    names = names.replace(',', '')
    namesList = splitNames(names)
    
    # Delete empty entries and comma separators from list if not previously caught
    while('' in namesList):
        namesList.remove('')
    while(' ' in namesList):
        namesList.remove(' ')
        
    # Get the JSON file's data, append the names to the type, sort, and save
    file = getNamelist(namelist)
    data = json.load(file)

    match type:
        case 'Male':
            if replaceNames:
                data['male'].clear()
            for name in namesList:
                if '"' in name:
                    data['male'].append(name.replace('"',''))
                else:
                    data['male'].append(name)
            data['male'] = list(set(data['male']))
            data['male'].sort()

        case 'Female':
            if replaceNames:
                data['female'].clear()
            for name in namesList:
                if '"' in name:
                    data['female'].append(name.replace('"',''))
                else:
                    data['female'].append(name)
            data['female'] = list(set(data['female']))
            data['female'].sort()
            
        case 'Surname':
            if replaceNames:
                data['surname'].clear()
            for name in namesList:
                if '"' in name:
                    data['surname'].append(name.replace('"',''))
                else:
                    data['surname'].append(name)
            data['surname'] = list(set(data['surname']))
            data['surname'].sort()
        
        case 'Neutral':
            if replaceNames:
                data['neutral'].clear()
            for name in namesList:
                if '"' in name:
                    data['neutral'].append(name.replace('"',''))
                else:
                    data['neutral'].append(name)
            data['neutral'] = list(set(data['neutral']))
            data['neutral'].sort()
                
    with open(file.name, 'w',encoding='utf-8') as f:
        json.dump(data, f, indent=4,ensure_ascii=False)
            
# Return a string containing all names in passed namelist and type
def dumpNamesFromJson(namelist:str, type:str):
    
    data = json.load(getNamelist(namelist))
    newText = ''
    
    match type:
        case 'Male':
            for name in data['male']:
                if ' ' in name:
                    newText = newText + '"' + name + '" '
                else:
                    newText = newText + name + ' '
        case 'Female':
            for name in data['female']:
                if ' ' in name:
                    newText = newText + '"' + name + '" '
                else:
                    newText = newText + name + ' '
        case 'Surname':
            for name in data['surname']:
                if ' ' in name:
                    newText = newText + '"' + name + '" '
                else:
                    newText = newText + name + ' '
        case 'Neutral':
            for name in data['neutral']:
                if ' ' in name:
                    newText = newText + '"' + name + '" '
                else:
                    newText = newText + name + ' '
    return newText[:-1] # Remove extra space from the end of the string