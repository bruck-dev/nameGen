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

# Split names into list along spaces, ignoring single quotes
def splitNames(string:str) -> list:
    split = shlex.shlex(string)
    split.quotes = '"'
    split.whitespace_split = True
    split.commenters = ''
    return list(split)

# Returns all keys found in a dict. Stolen from stackexchange and frankly I barely know how this works
def getDictKeys(d, c = []) -> list:
  keys = [i for a, b in d.items() for i in ([c+[a]] if not isinstance(b, dict) else getDictKeys(b, c+[a]))]
  return keys

# Updates all values in dict d with values from dict u if the key is the same
def updateDict(d, u) -> dict:
    for k, v in u.items():
        if isinstance(v, collections.abc.Mapping):
            d[k] = updateDict(d.get(k, {}), v)
        else:
            d[k] = v
    return d

# Returns all items in a dict key, even when nested
def getDictItems(d:dict, keyPath:list) -> list:
    return reduce(operator.getitem, keyPath, d)

# Deletes keys from passed dict until last entry in the specified path is reached
def delDictKey(d:dict, keyPath:list):
    if len(keyPath) == 1 and keyPath[0] in d:
        del d[keyPath[0]]
    for key in d.values():
        if isinstance(key, dict):
            delDictKey(key, keyPath[1:])
    return d

# Returns path to all json files in directory
def getJson(path:str) -> list:
    return glob.glob(path + '/*.json')

# Returns all keys in json file, and separates subkeys from their dict by a '.'
def getJsonKeys(path:str) -> list:
    data = json.load(open(path, encoding='utf-8'))
    result = list(map('.'.join, getDictKeys(data)))
    result.remove('description')
    result.remove('title')
    result.sort()
    return result

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

# Adds new key based on the path to the JSON file
def addJsonKey(path:str, key:str):
    splitKey = key.split('.')
    data = json.load(open(path, encoding='utf-8'))
    emptyList = []
    update = reduce(lambda k, v: {v: k}, reversed(splitKey), emptyList) # for some weird reason this needs to be a defined variable, [] by itself doesn't work
    data = updateDict(data, update)
    with open(path, 'w',encoding='utf-8') as f:
        json.dump(data, f, indent=4,ensure_ascii=False)

# Removes key based on path
def removeJsonKey(path:str, key:str):
    splitKey = key.split('.')
    data = json.load(open(path, encoding='utf-8'))
    data = delDictKey(data, splitKey)
    with open(path, 'w',encoding='utf-8') as f:
        json.dump(data, f, indent=4,ensure_ascii=False)