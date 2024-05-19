#!/usr/bin/env python
# coding=utf-8

"""Utility file containing JSON manipulation functions."""
__author__ = "bruck"
__version__ = "0.1.A"
__status__ = "Development"


import shlex
import json
import glob
from functools import reduce
import operator
import collections.abc

# Returns path to all json files in directory
def getJson(path) -> list:
    return glob.glob(path + '/*.json')

# Returns all keys in json file, and separates subkeys from their dict by a '.'
def getJsonKeys(jsonDict) -> list:
    result = list(map('.'.join, getKeys(jsonDict)))
    result.remove('description')
    result.remove('title')
    result.sort()
    return result

# Returns all keys found in a dict. Stolen from stackexchange and frankly I barely know how this works
def getKeys(d, c = []) -> list:
  keys = [i for a, b in d.items() for i in ([c+[a]] if not isinstance(b, dict) else getKeys(b, c+[a]))]
  return keys

# Split names into list along spaces, ignoring single quotes
def splitNames(string:str) -> list:
    split = shlex.shlex(string)
    split.quotes = '"'
    split.whitespace_split = True
    split.commenters = ''
    return list(split)

# Add passed names to namelist, or replace if told to do so
def addToJson(names:str, path:str, key:str, replace:bool):

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
    data = json.load(open(path, encoding='utf-8'))
    splitKey = key.split('.')
    
    if(replace):
        lst = []
    else:
        lst = getDictItems(data, splitKey)  
    for name in namesList:
        if '"' in name:
            lst.append(name.replace('"', ''))
        else:
            lst.append(name)
    lst = list(set(lst))
    lst.sort()
    
    update = reduce(lambda k, v: {v: k}, reversed(splitKey), lst)
    data = updateDict(data, update)
    
    with open(path, 'w',encoding='utf-8') as f:
        json.dump(data, f, indent=4,ensure_ascii=False)

# Updates all values in dict d with values from dict u if the key is the same
def updateDict(d, u) -> dict:
    for k, v in u.items():
        if isinstance(v, collections.abc.Mapping):
            d[k] = updateDict(d.get(k, {}), v)
        else:
            d[k] = v
    return d
            
# Return a string containing all names in passed namelist and type
def dumpFromJson(path:str, key:str) -> str:
    data = json.load(open(path, encoding='utf-8'))
    newText = ''
    lst = getDictItems(data, key.split('.'))
    
    for name in lst:
        if ' ' in name:
            newText = newText + '"' + name + '" '
        else:
            newText = newText + name + ' '
    return newText[:-1] # Remove extra space from the end of the string

# Returns all items in a dict key, even when nested
def getDictItems(d:dict, keyPath:list) -> list:
    return reduce(operator.getitem, keyPath, d)