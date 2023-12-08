#!/usr/bin/env python
# coding=utf-8

"""Utility file containing non-JSON file editing and retrieval functions."""
__author__ = "bruck"
__version__ = "1.0.0"
__status__ = "Development"

import glob

def getMusic():
    return glob.glob("assets/music/*.wav") + glob.glob("assets/music/*.mp3")