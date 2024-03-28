#!/usr/bin/env python
# coding=utf-8

"""
Random name generator designed to support a multitude of fantasy races and/or cultures.

Launches a PyQt6 application where namelist JSON files are used to create the name of a
character, given a race and gender. Surnames can optionally also be generated and appended
to the name Has a built-in background music player that enables if files are found in
assets/music/ and of the type .mp3, .wav, or .flac.
"""
__author__ = "bruck"
__version__ = "0.1.A"
__status__ = "Development"


## Backend Imports ##
import time, random
from util.jsonProcessing import *
from util.fileProcessing import *

## PyQt Framework Imports ##
from PyQt6.QtCore import Qt
from PyQt6.QtCore import QUrl
from PyQt6.QtMultimedia import QAudioOutput, QMediaPlayer
from PyQt6.QtWidgets import (
    QApplication,
    QMainWindow,
    QWidget,
    QLabel,
    QLineEdit,
    QPlainTextEdit,
    QPushButton,
    QCheckBox,
    QComboBox,
    QVBoxLayout,
    QHBoxLayout,
    QTabWidget,
    QGridLayout,
    QFormLayout,
    QGroupBox,
    QWidget,
    QStyle
)
from PyQt6.QtGui import QIcon, QPixmap
from tinytag import TinyTag

class Main(QMainWindow):
    def __init__(self):
        super().__init__()
        
        #region Global Variables
        self.playIcon = self.style().standardIcon(QStyle.StandardPixmap.SP_MediaPlay)
        self.pauseIcon = self.style().standardIcon(QStyle.StandardPixmap.SP_MediaPause)
        #endregion
        
        #region Widgets
        ## Window Setup ##
        self.setWindowTitle('Bruck\'s JSON Editor')
        self.setFixedSize(500, 525)
        
        ## Audio Setup ##
        self.player = AudioPlayer()
        
        ## Widget Init ##
        tab = QTabWidget(self, movable=False, tabsClosable=False)
        
        # JSON Page #
        jsonAddNamesButton = QPushButton('Add')
        jsonAddNamesButton.setFixedSize(75, 25)
        jsonReplaceNamesButton = QPushButton('Replace')
        jsonReplaceNamesButton.setFixedSize(75, 25)
        jsonDumpNamesButton = QPushButton('Get')
        jsonDumpNamesButton.setFixedSize(75, 25)
        jsonClearButton = QPushButton('Clear')
        jsonClearButton.setFixedSize(75, 25)
        
        jsonRootLabel = QLabel('Root Folder')
        self.jsonRootCombo = QComboBox()
        self.jsonRootCombo.addItems(getImmediateSubdirs('assets\\namelists'))
        self.jsonRootCombo.setFixedSize(225, 25)
        
        jsonSubfolderLabel = QLabel('Subfolder')
        self.jsonSubfolderCombo = QComboBox()
        self.jsonSubfolderCombo.addItems(getJsonDirectories(self.jsonRootCombo.currentText()))
        self.jsonSubfolderCombo.setFixedSize(225, 25)
        
        jsonFileLabel = QLabel('JSON File')
        self.jsonFileCombo = QComboBox()
        self.jsonFileCombo.addItems(getJson(self.jsonSubfolderCombo.currentText()))
        self.jsonFileCombo.setFixedSize(225, 25)
        
        jsonKeysLabel = QLabel('JSON Key')
        self.jsonKeysCombo = QComboBox()
        self.jsonKeysCombo.addItems(getJsonKeys(json.load(open(self.jsonFileCombo.currentText()))))
        self.jsonKeysCombo.setFixedSize(225, 25)
        self.jsonInputBox = QPlainTextEdit()
        
        self.jsonKeyBox = QLineEdit()
        self.jsonKeyBox.setFixedSize(225, 25)
        jsonKeyBoxLabel = QLabel('Key Editor')
        jsonAddKeyButton = QPushButton('Add Key')
        jsonAddKeyButton.setFixedSize(75, 25)
        jsonRemoveKeyButton = QPushButton('Remove Key')
        jsonRemoveKeyButton.setFixedSize(75, 25)
        
        # Music Control Page #
        self.musicPlayButton = QPushButton()
        self.musicPlayButton.setFixedSize(100, 25)
        self.musicSkipFButton = QPushButton()
        self.musicSkipFButton.setFixedSize(100, 25)
        self.musicSkipBButton = QPushButton()
        self.musicSkipBButton.setFixedSize(100, 25)
        self.musicPlayButtonState = -1
        self.musicPlayButton.setIcon(self.playIcon)
        self.musicSkipFButton.setIcon(self.style().standardIcon(QStyle.StandardPixmap.SP_MediaSkipForward))
        self.musicSkipBButton.setIcon(self.style().standardIcon(QStyle.StandardPixmap.SP_MediaSkipBackward))
        
        musicPageTitleLabel = QLabel('Title')
        font = musicPageTitleLabel.font()
        font.setBold(True)
        musicPageTitleLabel.setFont(font)
        self.musicPageTitle = QLabel()
        self.musicPageTitle.setWordWrap(True)
        
        musicPageArtistLabel = QLabel('Artist')
        font = musicPageArtistLabel.font()
        font.setBold(True)
        musicPageArtistLabel.setFont(font)
        self.musicPageArtist = QLabel()
        
        musicPageAlbumLabel = QLabel('Album')
        font = musicPageAlbumLabel.font()
        font.setBold(True)
        self.musicPageArtist.setWordWrap(True)
        musicPageAlbumLabel.setFont(font)
        self.musicPageAlbum = QLabel()
        self.musicPageAlbum.setWordWrap(True)
        
        musicPageLengthLabel = QLabel('\n')
        musicPageLengthLabel.setFont(font)
        self.musicPageLength = QLabel()
        self.musicPageLength.setWordWrap(True)
        
        self.albumCover = QPixmap()
        self.musicPageImageLabel = QLabel()
        self.musicPageImageLabel.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.musicPageImageLabel.setPixmap(self.albumCover)
        #endregion
        
        #region Signals
        ## Signal Connection Configuration ##
        # JSON Page #
        self.jsonRootCombo.currentTextChanged.connect(self.rootUpdated)
        self.jsonSubfolderCombo.currentTextChanged.connect(self.subdirUpdated)
        self.jsonFileCombo.currentTextChanged.connect(self.fileUpdated)
        jsonAddNamesButton.clicked.connect(self.addNames)
        jsonReplaceNamesButton.clicked.connect(self.replaceNames)
        jsonDumpNamesButton.clicked.connect(self.dumpNames)
        jsonClearButton.clicked.connect(self.clearInputBox)
        jsonAddKeyButton.clicked.connect(self.addKey)
        jsonRemoveKeyButton.clicked.connect(self.removeKey)
        
        # Music Control Page #
        self.player.mediaStatusChanged.connect(self.musicUpdatePlaying)
        self.player.positionChanged.connect(self.musicProgress)
        self.musicPlayButton.clicked.connect(self.musicPlayButtonClicked)
        self.musicSkipFButton.clicked.connect(self.musicSkipFButtonClicked)
        self.musicSkipBButton.clicked.connect(self.musicSkipBButtonClicked)
        #endregion
        
        #region Layout Configuration
        ## Page Layouts ##
        # JSON Processing Layout #
        jsonPage = QWidget()
        jsonPage.layout = QHBoxLayout()
        
        jsonPageButtonGroup = QGroupBox()
        jsonPageButtonGroup.layout = QGridLayout()
        jsonPageButtonGroup.layout.addWidget(jsonAddNamesButton, 0, 0)
        jsonPageButtonGroup.layout.addWidget(jsonReplaceNamesButton, 0, 1)
        jsonPageButtonGroup.layout.addWidget(jsonDumpNamesButton, 1, 0)
        jsonPageButtonGroup.layout.addWidget(jsonClearButton, 1, 1)
        jsonPageButtonGroup.setLayout(jsonPageButtonGroup.layout)
        
        jsonPageKeyGroup = QGroupBox()
        jsonPageKeyGroup.layout = QVBoxLayout()
        jsonPageKeyButtonGroup = QGroupBox()
        jsonPageKeyButtonGroup.layout = QHBoxLayout()
        jsonPageKeyButtonGroup.layout.addWidget(jsonAddKeyButton)
        jsonPageKeyButtonGroup.layout.addWidget(jsonRemoveKeyButton)
        jsonPageKeyButtonGroup.setFlat(True)
        jsonPageKeyButtonGroup.setLayout(jsonPageKeyButtonGroup.layout)
        
        jsonPageKeyGroup.layout.addWidget(jsonKeyBoxLabel)
        jsonPageKeyGroup.layout.addWidget(self.jsonKeyBox)
        jsonPageKeyGroup.layout.addWidget(jsonPageKeyButtonGroup)
        jsonPageKeyGroup.setLayout(jsonPageKeyGroup.layout)
        
        jsonPageControlGroup = QGroupBox()
        jsonPageControlGroup.layout = QFormLayout()
        jsonPageControlGroup.layout.addWidget(jsonRootLabel)
        jsonPageControlGroup.layout.addWidget(self.jsonRootCombo)
        jsonPageControlGroup.layout.addWidget(jsonSubfolderLabel)
        jsonPageControlGroup.layout.addWidget(self.jsonSubfolderCombo)
        jsonPageControlGroup.layout.addWidget(jsonFileLabel)
        jsonPageControlGroup.layout.addWidget(self.jsonFileCombo)
        jsonPageControlGroup.layout.addWidget(jsonKeysLabel)
        jsonPageControlGroup.layout.addWidget(self.jsonKeysCombo)
        jsonPageControlGroup.layout.addRow(jsonPageKeyGroup)
        jsonPageControlGroup.layout.addRow(jsonPageButtonGroup)
        jsonPageControlGroup.setLayout(jsonPageControlGroup.layout)
        
        jsonPage.layout.addWidget(jsonPageControlGroup)
        jsonPage.layout.addWidget(self.jsonInputBox)
        
        jsonPage.setLayout(jsonPage.layout)
        tab.addTab(jsonPage, 'JSON Editor')
        
        # Music Control Layout #
        musicPage = QWidget()
        musicPage.layout = QVBoxLayout()
        musicPageControlGroup = QGroupBox()
        musicPageControlGroup.layout = QGridLayout()
        musicPageControlGroup.layout.addWidget(self.musicSkipBButton, 0, 0)
        musicPageControlGroup.layout.addWidget(self.musicPlayButton, 0, 1)
        musicPageControlGroup.layout.addWidget(self.musicSkipFButton, 0, 2)
        musicPageControlGroup.setLayout(musicPageControlGroup.layout)
        musicPageControlGroup.setFixedHeight(50)
        
        musicPageData = QGroupBox()
        musicPageData.layout = QVBoxLayout()
        musicPageData.layout.addWidget(musicPageTitleLabel)
        musicPageData.layout.addWidget(self.musicPageTitle)
        musicPageData.layout.addWidget(musicPageArtistLabel)
        musicPageData.layout.addWidget(self.musicPageArtist)
        musicPageData.layout.addWidget(musicPageAlbumLabel)
        musicPageData.layout.addWidget(self.musicPageAlbum)
        musicPageData.layout.addWidget(musicPageLengthLabel)
        musicPageData.layout.addWidget(self.musicPageLength, alignment=Qt.AlignmentFlag.AlignCenter)
        musicPageData.setLayout(musicPageData.layout)
        musicPageData.setFixedSize(200, 225)
        
        musicPageImage = QGroupBox()
        musicPageImage.layout = QVBoxLayout()
        musicPageImage.layout.addWidget(self.musicPageImageLabel, alignment=Qt.AlignmentFlag.AlignCenter)
        musicPageImage.setLayout(musicPageImage.layout)
        musicPageImage.setFixedSize(225, 225)
        
        musicPageMetaDataGroup = QWidget()
        musicPageMetaDataGroup.layout = QHBoxLayout()
        musicPageMetaDataGroup.layout.addWidget(musicPageData)
        musicPageMetaDataGroup.layout.addWidget(musicPageImage)
        musicPageMetaDataGroup.setLayout(musicPageMetaDataGroup.layout)
        
        musicPage.layout.addWidget(musicPageMetaDataGroup, alignment=Qt.AlignmentFlag.AlignCenter)
        musicPage.layout.addWidget(musicPageControlGroup, alignment=Qt.AlignmentFlag.AlignCenter)
        musicPage.layout.addStretch()
        musicPage.setLayout(musicPage.layout)
        
        if self.player.tracks is not None:
            tab.addTab(musicPage, 'Music Controls')
        
        
        ## Finalize Window Layout ##
        container = QWidget()
        container.layout = QGridLayout()
        self.setCentralWidget(container)
        container.setLayout(container.layout)
        container.layout.addWidget(tab)
        #endregion

    # Dropdown update functions
    def rootUpdated(self):
        self.jsonSubfolderCombo.blockSignals(True)
        self.jsonSubfolderCombo.clear()
        self.jsonSubfolderCombo.addItems(getJsonDirectories(self.jsonRootCombo.currentText()))
        self.jsonSubfolderCombo.blockSignals(False)
        
        self.jsonFileCombo.blockSignals(True)
        self.jsonFileCombo.clear()
        self.jsonFileCombo.addItems(getJson(self.jsonSubfolderCombo.currentText()))
        self.jsonFileCombo.blockSignals(False)
        
        self.jsonKeysCombo.blockSignals(True)
        self.jsonKeysCombo.clear()
        self.jsonKeysCombo.addItems(getJsonKeys(json.load(open(self.jsonFileCombo.currentText()))))
        self.jsonKeysCombo.blockSignals(False)
    
    def subdirUpdated(self):
        self.jsonFileCombo.blockSignals(True)
        self.jsonFileCombo.clear()
        self.jsonFileCombo.addItems(getJson(self.jsonSubfolderCombo.currentText()))
        self.jsonFileCombo.blockSignals(False)
        
        self.jsonKeysCombo.blockSignals(True)
        self.jsonKeysCombo.clear()
        self.jsonKeysCombo.addItems(getJsonKeys(json.load(open(self.jsonFileCombo.currentText()))))
        self.jsonKeysCombo.blockSignals(False)
        
    def fileUpdated(self):
        self.jsonKeysCombo.blockSignals(True)
        self.jsonKeysCombo.clear()
        self.jsonKeysCombo.addItems(getJsonKeys(json.load(open(self.jsonFileCombo.currentText()))))
        self.jsonKeysCombo.blockSignals(False)
        
    def addKey(self):
        key = self.jsonKeyBox.text()
        data = json.load(open(self.jsonFileCombo.currentText(), encoding='utf-8'))
        data[key] = []
        with open(self.jsonFileCombo.currentText(), 'w',encoding='utf-8') as f:
            json.dump(data, f, indent=4,ensure_ascii=False)
        self.jsonKeysCombo.clear()
        self.jsonKeysCombo.addItems(getJsonKeys(json.load(open(self.jsonFileCombo.currentText()))))
    def removeKey(self):
        key = self.jsonKeyBox.text()
        data = json.load(open(self.jsonFileCombo.currentText(), encoding='utf-8'))
        try:
            del data[key]
        except:
            pass # Key didn't exist, ignore
        with open(self.jsonFileCombo.currentText(), 'w',encoding='utf-8') as f:
            json.dump(data, f, indent=4,ensure_ascii=False)
        self.jsonKeysCombo.clear()
        self.jsonKeysCombo.addItems(getJsonKeys(json.load(open(self.jsonFileCombo.currentText()))))
        
    # Name Processing Functions
    def addNames(self):
        addToJson(self.jsonInputBox.toPlainText(), self.jsonFileCombo.currentText(), self.jsonKeysCombo.currentText(), False)
    def replaceNames(self):
        addToJson(self.jsonInputBox.toPlainText(), self.jsonFileCombo.currentText(), self.jsonKeysCombo.currentText(), True)
    def dumpNames(self):
        self.jsonInputBox.clear()
        self.jsonInputBox.appendPlainText(dumpFromJson(self.jsonFileCombo.currentText(), self.jsonKeysCombo.currentText()))

    # Clears the input box on press
    def clearInputBox(self):
        self.jsonInputBox.clear()
        
    # Update song title, artist, album, album art, etc. when new song is played
    def musicUpdatePlaying(self, status):
        if status == QMediaPlayer.MediaStatus.LoadedMedia:
            self.albumCover.loadFromData(self.player.tag.get_image())
            if self.albumCover.isNull():
                self.albumCover = QPixmap('assets/gui/unknownAlbum.jpg')
            self.albumCover = self.albumCover.scaled(200, 200, aspectRatioMode=Qt.AspectRatioMode.KeepAspectRatio, transformMode=Qt.TransformationMode.SmoothTransformation)
            self.musicPageImageLabel.setPixmap(self.albumCover)
            
            metaData = [self.player.tag.title, self.player.tag.artist, self.player.tag.album, self.player.runtime]
            if metaData[0] is not None:
                self.musicPageTitle.setText(metaData[0])
            else:
                self.musicPageTitle.setText('Unknown')
            if metaData[1] is not None:
                self.musicPageArtist.setText(metaData[1])
            else:
                self.musicPageArtist.setText('Unknown')
            if metaData[2] is not None:
                self.musicPageAlbum.setText(metaData[2])
            else:
                self.musicPageAlbum.setText('Unknown')
            if metaData[3] is not None or metaData[3] != '':
                self.musicPageLength.setText('0:00 / ' + metaData[3])
            else:
                self.musicPageLength.setText('Unknown/Unknown')
    
    # Pause or unpause song and change icon
    def musicPlayButtonClicked(self):
        if self.musicPlayButtonState <= 0:
            self.musicPlayButtonState = 1
            self.musicPlayButton.setIcon(self.pauseIcon)
            self.player.play()
        elif self.musicPlayButtonState == 1:
            self.musicPlayButtonState = 2
            self.musicPlayButton.setIcon(self.playIcon)
            self.player.pause()
        elif self.musicPlayButtonState == 2:
            self.musicPlayButtonState = 1
            self.musicPlayButton.setIcon(self.pauseIcon)
            self.player.play()
            
    def musicSkipFButtonClicked(self):
        self.player.skipForward()
        self.musicPlayButtonState = 1
        self.musicPlayButton.setIcon(self.pauseIcon)
    
    def musicSkipBButtonClicked(self):
        self.player.skipBackward()
        self.musicPlayButtonState = 1
        self.musicPlayButton.setIcon(self.pauseIcon)
        
    # Update length label to current song time
    def musicProgress(self, t):
        t = int(t / 1000)
        time = str(int(t / 60)) + ':'
        sec = int(t % 60)
        if sec < 10:
            time += '0' + str(sec)
        else:
            time += str(sec)
        self.musicPageLength.setText(time + " / " + self.player.runtime)
    
class AudioPlayer(QMediaPlayer):
    def __init__(self):
        super().__init__()
        self.audioOut = QAudioOutput()
        self.setAudioOutput(self.audioOut)
        self.audioOutput().setVolume(.5)
        self.currentVolume = self.audioOut.volume()
        self.activeTrack = 0
        self.runtime = ''
        
        self.mediaStatusChanged.connect(self.detectSongChange)
        
        # Set track list and shuffle
        self.tracks = getMusic()
        if self.tracks is not None:
            random.shuffle(self.tracks)
            self.changeSong()
        
    def play(self):
        super().play()
        
    def pause(self):
        super().pause()
        
    def stop(self):
        super().stop()
        
    def skipForward(self):
        self.stop()
        if self.activeTrack < len(self.tracks) - 1:
            self.activeTrack += 1
        else:
            self.activeTrack = 0
        while self.playbackState() != QMediaPlayer.PlaybackState.StoppedState:
            pass
        time.sleep(0.001)
        self.changeSong()
        self.play()
        
    def skipBackward(self):
        self.stop()
        if self.activeTrack < len(self.tracks) and self.activeTrack > 0:
            self.activeTrack -= 1
        else:
            self.activeTrack = len(self.tracks) - 1
        while self.playbackState() != QMediaPlayer.PlaybackState.StoppedState:
            pass
        time.sleep(0.001)
        self.changeSong()
        self.play()
    
    # Change to next song in playlist
    def changeSong(self):
        self.setSource(QUrl.fromLocalFile(self.tracks[self.activeTrack]))
        self.tag = TinyTag.get(self.tracks[self.activeTrack], image=True)
        
        self.runtime = str(int(self.tag.duration / 60)) + ':'
        sec = int(self.tag.duration % 60)
        if sec < 10:
            self.runtime += '0' + str(sec)
        else:
            self.runtime += str(sec)
        
    # Checks for when currently playing media changes
    def detectSongChange(self, status):
        if status == QMediaPlayer.MediaStatus.EndOfMedia:
            self.stop()
            
            if self.activeTrack < len(self.tracks) - 1:
                self.activeTrack += 1
            else:
                self.activeTrack = 0
                
            # Ensure the media has fully stopped, and then wait 1ms to make sure it's fully ready to change source
            while self.playbackState() != QMediaPlayer.PlaybackState.StoppedState:
                pass
            time.sleep(0.001)
            
            self.changeSong()
            self.play()
    
# Execute App
app = QApplication([])
app.setStyle('Fusion')
app.setWindowIcon(QIcon('assets/gui/bruck.png'))
window = Main()
window.show()
app.exec()