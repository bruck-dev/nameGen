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

def getLowestSubdir(firstDir):
    lowestDir = list()
    for root,dirs,files in os.walk(firstDir):
        if files and not dirs:
            lowestDir.append(root)
    return lowestDir
            
def getJson(path):
    return glob.glob(path + '/*.json')

def getJsonKeys(json):
    keys = list(json.keys())
    keys.remove('title')
    keys.remove('description')
    keys.sort()
    return keys

def getImmediateSubdirs(dir):
    return [f.path for f in os.scandir(dir) if f.is_dir()]