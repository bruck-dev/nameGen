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

def getImmediateSubdirs(dir):
    return [f.path for f in os.scandir(dir) if f.is_dir()]