#!/usr/bin/env python
# coding=utf-8

"""Utility file containing JSON manipulation functions."""
__author__ = "bruck"
__version__ = "0.1.A"
__status__ = "Development"


import shlex
import json

# Split names into list along spaces, ignoring single quotes
def splitNames(string:str):
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
    
    if replace:
        data[key].clear()
    for name in namesList:
        if '"' in name:
            data[key].append(name.replace('"',''))
        else:
            data[key].append(name)
    data[key] = list(set(data[key]))
    data[key].sort()
    
    with open(path, 'w',encoding='utf-8') as f:
        json.dump(data, f, indent=4,ensure_ascii=False)
            
# Return a string containing all names in passed namelist and type
def dumpFromJson(path, key):
    
    data = json.load(open(path, encoding='utf-8'))
    newText = ''
    
    for name in data[key]:
        if ' ' in name:
            newText = newText + '"' + name + '" '
        else:
            newText = newText + name + ' '
    return newText[:-1] # Remove extra space from the end of the string