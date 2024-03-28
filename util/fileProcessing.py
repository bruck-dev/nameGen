#!/usr/bin/env python
# coding=utf-8

"""Utility file containing non-JSON file editing and retrieval functions."""
__author__ = "bruck"
__version__ = "0.1.A"
__status__ = "Development"

import glob
import os

def getMusic():
    return glob.glob("assets/music/*.wav") + glob.glob("assets/music/*.mp3") + glob.glob("assets/music/*.flac")

def getJsonDirectories(firstDir):
    directories = list()
    for root,dirs,files in os.walk(firstDir):
        if files and not dirs:
            directories.append(root)
        elif files and dirs:
            for file in files:
                if file.endswith(".json"):
                    directories.append(root)
                    break
    return directories
            
def getJson(path):
    paths = glob.glob(path + '/*.json')
    
    # Don't show config files
    for element in paths:
        if "config" in element:
            del paths[paths.index(element)]
            
    return paths

def getJsonKeys(json):
    keys = list(json.keys())
    keys.remove('title')
    keys.remove('description')
    keys.sort()
    return keys

def getImmediateSubdirs(dir):
    return [f.path for f in os.scandir(dir) if f.is_dir()]