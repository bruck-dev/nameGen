#!/usr/bin/env python
# coding=utf-8

"""Random name generator designed to support a multitude of fantasy races and/or cultures.

Launches a PyQt6 application where namelist JSON files are used to create the name of a
character, given a race and gender. Surnames can optionally also be generated and appended
to the name.
"""
__author__ = "bruck"
__version__ = "1.0.0"
__status__ = "Development"


## Backend Imports ##
import time
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
    QWidget
)
from PyQt6.QtGui import QIcon

class Main(QMainWindow):
    def __init__(self):
        super().__init__()
        
        ## Saved Values ##
        # Namelist Declarations #
        self.titleLists = ['Nobility', 'Military', 'Religious', 'Occupation']
        self.jsonTitleLists = ['Noble Titles', 'Military Titles', 'Religious Titles', 'Occupations']
        self.epithetLists = ['Suffixes', 'Nicknames', 'Sobriquets', 'Animals']
        self.raceList = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Tiefling', 'Orc']
        self.humanNamelists = ['Western', 'Eastern']
        self.elfNamelists = ['High Elf', 'Wood Elf','Dark Elf', 'Drow']
        self.dwarfNamelists = ['Dwarf']
        self.halflingNamelists = ['Placeholder']
        self.tieflingNamelists = ['Infernal', 'Virtue']
        self.orcNamelists = ['Placeholder']
        self.availableNamelists = [self.humanNamelists, self.elfNamelists, self.dwarfNamelists, self.titleLists, self.epithetLists]
        
        self.genNamelist = self.jsonNamelist = self.availableNamelists[0][0]
        self.genderList = ['Male', 'Female', 'Neutral']
        self.typeList = ['Male', 'Female', 'Surname', 'Neutral'] # different from the gender list in that is has to include unselectable JSON keys
        self.genGender = self.jsonNameType = self.genderList[0]
        self.genRace =  self.jsonRace = self.raceList[0]
        self.genSurnameEnabled = True
        self.genEpithet = None
        self.genTitle = None
        
        ## Window Setup ##
        self.setWindowTitle('Bruck\'s Name Generator')
        self.setFixedSize(500, 425)
        
        ## Audio Setup ##
        self.player = AudioPlayer()
        
        ## Widget Init ##
        tab = QTabWidget(self, movable=False, tabsClosable=False)
                    
        # Generator Page #
        genButton = QPushButton('Generate')
        genListLabel = QLabel('Desired Namelist')
        self.genListCombo = QComboBox()
        self.genListCombo.addItems(self.availableNamelists[0])
        self.genListCombo.setFixedSize(100, 25)
        genRaceLabel = QLabel('Character Race')
        genRaceCombo = QComboBox()
        genRaceCombo.addItems(self.raceList)
        genRaceCombo.setFixedSize(100, 25)
        genGenderLabel = QLabel('Character Sex')
        self.genGenderCombo = QComboBox()
        self.genGenderCombo.addItems(self.genderList)
        self.genGenderCombo.setFixedSize(100, 25)
        self.comboToggleRow(self.genGenderCombo, 2, False) # Disable Gender Neutral
        genSurnameLabel = QLabel('Generate Surname?')
        genSurnameCheck = QCheckBox()
        genSurnameCheck.setChecked(True)
        genEpithetLabel = QLabel('Generate Epithet?')
        genEpithetCheck = QCheckBox()
        genEpithetCheck.setChecked(False)
        self.genEpithetCombo = QComboBox()
        self.genEpithetCombo.addItems(self.epithetLists)
        self.genEpithetCombo.setFixedSize(100, 25)
        self.genEpithetCombo.hide()
        genTitleLabel = QLabel('Generate Title?')
        genTitleCheck = QCheckBox()
        genTitleCheck.setChecked(False)
        self.genTitleCombo = QComboBox()
        self.genTitleCombo.addItems(self.titleLists)
        self.genTitleCombo.setFixedSize(100, 25)
        self.genTitleCombo.hide()
        self.genOutputBox = QLineEdit()
        self.genOutputBox.setReadOnly(True)
        self.genOutputBox.setFixedHeight(50)
        self.genOutputBox.setAlignment(Qt.AlignmentFlag.AlignCenter)
        font = self.genOutputBox.font()
        font.setPointSize(16)
        self.genOutputBox.setFont(font)
        
        # JSON Page #
        jsonAddNamesButton = QPushButton('Add')
        jsonAddNamesButton.setFixedSize(75, 25)
        jsonReplaceNamesButton = QPushButton('Replace')
        jsonReplaceNamesButton.setFixedSize(75, 25)
        jsonDumpNamesButton = QPushButton('Get')
        jsonDumpNamesButton.setFixedSize(75, 25)
        jsonClearButton = QPushButton('Clear')
        jsonClearButton.setFixedSize(75, 25)
        jsonListLabel = QLabel('Namelist')
        self.jsonListCombo = QComboBox()
        self.jsonListCombo.addItems(self.availableNamelists[0])
        self.jsonListCombo.setFixedSize(100, 25)
        jsonRaceLabel = QLabel('Namelist Type')
        jsonRaceCombo = QComboBox()
        jsonRaceCombo.addItems(self.raceList)
        jsonRaceCombo.addItems(['Titles', 'Epithets'])
        jsonRaceCombo.setFixedSize(100, 25)
        jsonNameTypeLabel = QLabel('Name Type')
        self.jsonNameTypeCombo = QComboBox()
        self.jsonNameTypeCombo.addItems(self.typeList)
        self.jsonNameTypeCombo.setFixedSize(100, 25)
        self.comboToggleRow(self.jsonNameTypeCombo, 3, False) # Disable Gender Neutral
        self.jsonInputBox = QPlainTextEdit()
        
        # Music Control Page #
        
        
        ## Signal Connection Configuration ##
        # Generator Page #
        genButton.clicked.connect(self.generateName)
        genRaceCombo.currentTextChanged.connect(self.genRaceChanged)
        self.genListCombo.currentIndexChanged.connect(self.genNamelistChanged)
        self.genGenderCombo.currentTextChanged.connect(self.genGenderChanged)
        genSurnameCheck.stateChanged.connect(self.genSurnameChanged)
        genEpithetCheck.stateChanged.connect(self.genEpithetChanged)
        genTitleCheck.stateChanged.connect(self.genTitleChanged)
        self.genTitleCombo.currentTextChanged.connect(self.genTitleTypeChanged)
        self.genEpithetCombo.currentTextChanged.connect(self.genEpithetTypeChanged)
        
        # JSON Page #
        jsonAddNamesButton.clicked.connect(self.addNames)
        jsonReplaceNamesButton.clicked.connect(self.replaceNames)
        jsonDumpNamesButton.clicked.connect(self.dumpNames)
        jsonClearButton.clicked.connect(self.clearInputBox)
        jsonRaceCombo.currentTextChanged.connect(self.jsonRaceChanged)
        self.jsonListCombo.currentIndexChanged.connect(self.jsonNamelistChanged)
        self.jsonNameTypeCombo.currentTextChanged.connect(self.jsonNameTypeChanged)
        
        # Music Control Page #
        self.player.mediaStatusChanged.connect(self.musicUpdatePlaying)
        
        ## Page Layouts ##
        # Generator Page Layout #
        genPage = QWidget()
        genPage.layout = QVBoxLayout()
        
        genPageControlGroup = QGroupBox()
        genPageControlGroup.layout = QFormLayout()
        genPageControlGroup.layout.addWidget(genRaceLabel)
        genPageControlGroup.layout.addWidget(genRaceCombo)
        genPageControlGroup.layout.addWidget(genGenderLabel)
        genPageControlGroup.layout.addWidget(self.genGenderCombo)
        genPageControlGroup.layout.addWidget(genListLabel)
        genPageControlGroup.layout.addWidget(self.genListCombo)
        
        genPageCheckGroup = QGroupBox()
        genPageCheckGroup.layout = QGridLayout()
        genPageCheckGroup.layout.addWidget(genSurnameLabel, 0, 0, alignment=Qt.AlignmentFlag.AlignCenter)
        genPageCheckGroup.layout.addWidget(genSurnameCheck, 1, 0, alignment=Qt.AlignmentFlag.AlignCenter)
        genPageCheckGroup.layout.addWidget(genTitleLabel, 0, 1, alignment=Qt.AlignmentFlag.AlignCenter)
        genPageCheckGroup.layout.addWidget(genTitleCheck, 1, 1, alignment=Qt.AlignmentFlag.AlignCenter)
        genPageCheckGroup.layout.addWidget(self.genTitleCombo, 2, 1, alignment=Qt.AlignmentFlag.AlignCenter)
        genPageCheckGroup.layout.addWidget(genEpithetLabel, 0, 2, alignment=Qt.AlignmentFlag.AlignCenter)
        genPageCheckGroup.layout.addWidget(genEpithetCheck, 1, 2, alignment=Qt.AlignmentFlag.AlignCenter)
        genPageCheckGroup.layout.addWidget(self.genEpithetCombo, 2, 2, alignment=Qt.AlignmentFlag.AlignCenter)
        genPageCheckGroup.setLayout(genPageCheckGroup.layout)
        
        genPageControlGroup.layout.addWidget(genPageCheckGroup)
        genPageControlGroup.layout.addWidget(genButton)
        genPageControlGroup.layout.addWidget(self.genOutputBox)
        genPageControlGroup.setLayout(genPageControlGroup.layout)
        
        genPage.layout.addWidget(genPageControlGroup)
        
        genPage.setLayout(genPage.layout)
        tab.addTab(genPage, 'Generator')
        
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
        
        jsonPageControlGroup = QGroupBox()
        jsonPageControlGroup.layout = QFormLayout()
        jsonPageControlGroup.layout.addWidget(jsonRaceLabel)
        jsonPageControlGroup.layout.addWidget(jsonRaceCombo)
        jsonPageControlGroup.layout.addWidget(jsonListLabel)
        jsonPageControlGroup.layout.addWidget(self.jsonListCombo)
        jsonPageControlGroup.layout.addWidget(jsonNameTypeLabel)
        jsonPageControlGroup.layout.addWidget(self.jsonNameTypeCombo)
        jsonPageControlGroup.layout.addRow(jsonPageButtonGroup)
        jsonPageControlGroup.setLayout(jsonPageControlGroup.layout)
        
        jsonPage.layout.addWidget(jsonPageControlGroup)
        jsonPage.layout.addWidget(self.jsonInputBox)
        
        jsonPage.setLayout(jsonPage.layout)
        tab.addTab(jsonPage, 'Namelist Tools')
        
        # Music Control Layout #
        musicPage = QWidget()
        tab.addTab(musicPage, 'Music Controls')
        
        
        ## Finalize Window Layout ##
        container = QWidget()
        container.layout = QGridLayout()
        self.setCentralWidget(container)
        container.setLayout(container.layout)
        container.layout.addWidget(tab)
    
    # Generates the name
    def generateName(self):            
        self.genOutputBox.setText(generateNameFromJson(self.genNamelist, self.genGender, self.genSurnameEnabled, self.genEpithet, self.genTitle))
        
    # If race is changed, change available namelists
    def genRaceChanged(self, race:str):
        self.genListCombo.blockSignals(True)
        self.genRace = race
        match race:
            case 'Human':
                self.genListCombo.clear()
                self.genListCombo.addItems(self.humanNamelists)
            case 'Elf':
                self.genListCombo.clear()
                self.genListCombo.addItems(self.elfNamelists)           
            case 'Dwarf':
                self.genListCombo.clear()
                self.genListCombo.addItems(self.dwarfNamelists)            
            case 'Halfling':
                self.genListCombo.clear()
                self.genListCombo.addItems(self.halflingNamelists)              
            case 'Tiefling':
                self.genListCombo.clear()
                self.genListCombo.addItems(self.tieflingNamelists)              
            case 'Orc':
                self.genListCombo.clear()
                self.genListCombo.addItems(self.orcNamelists)
                
        # Gender Selector Reset (backup in case the namelist one misses a trigger)
        self.comboToggleRow(self.genGenderCombo, 0, True)
        self.comboToggleRow(self.genGenderCombo, 1, True)
        self.comboToggleRow(self.genGenderCombo, 2, False)
        
        self.genNamelist = self.genListCombo.currentText()
        self.genListCombo.blockSignals(False)
        
    def jsonRaceChanged(self, race:str):
        self.jsonListCombo.blockSignals(True)
        self.jsonRace = race
        match race:
            case 'Human':
                self.jsonListCombo.clear()
                self.jsonListCombo.addItems(self.humanNamelists)          
            case 'Elf':
                self.jsonListCombo.clear()
                self.jsonListCombo.addItems(self.elfNamelists)               
            case 'Dwarf':
                self.jsonListCombo.clear()
                self.jsonListCombo.addItems(self.dwarfNamelists)                  
            case 'Halfling':
                self.jsonListCombo.clear()
                self.jsonListCombo.addItems(self.halflingNamelists)                
            case 'Tiefling':
                self.jsonListCombo.clear()
                self.jsonListCombo.addItems(self.tieflingNamelists)                
            case 'Orc':
                self.jsonListCombo.clear()
                self.jsonListCombo.addItems(self.orcNamelists)              
            case 'Titles':
                self.jsonListCombo.clear()
                self.jsonListCombo.addItems(self.titleLists)
            case 'Epithets':
                self.jsonListCombo.clear()
                self.jsonListCombo.addItems(self.epithetLists)
                
        # Gender Selector Reset (backup in case the namelist one misses a trigger)
        if self.jsonRace == 'Titles' or self.jsonRace == 'Epithets':
            self.comboToggleRow(self.jsonNameTypeCombo, 0, True)
            self.comboToggleRow(self.jsonNameTypeCombo, 1, True)
            self.comboToggleRow(self.jsonNameTypeCombo, 3, True)
            self.comboToggleRow(self.jsonNameTypeCombo, 2, False)
        else:
            self.comboToggleRow(self.jsonNameTypeCombo, 0, True)
            self.comboToggleRow(self.jsonNameTypeCombo, 1, True)
            self.comboToggleRow(self.jsonNameTypeCombo, 2, True)
            self.comboToggleRow(self.jsonNameTypeCombo, 3, False)
        
        self.jsonNamelist = self.jsonListCombo.currentText()
        self.jsonListCombo.blockSignals(False)
    
    # Set namelist, depending on currently selected race
    def genNamelistChanged(self, index):
        match self.genRace:
            case 'Human':
                self.genNamelist = self.humanNamelists[index]
            case 'Elf':
                self.genNamelist = self.elfNamelists[index]             
            case 'Dwarf':
                self.genNamelist = self.dwarfNamelists[index]            
            case 'Halfling':
                self.genNamelist = self.halflingNamelists[index]               
            case 'Tiefling':
                self.genNamelist = self.tieflingNamelists[index]
            case 'Orc':
                self.genNamelist = self.orcNamelists[index]
        
        # Gender Selector Reset
        if self.genNamelist == 'Virtue':
            self.comboToggleRow(self.genGenderCombo, 2, True)
            self.comboToggleRow(self.genGenderCombo, 0, False)
            self.comboToggleRow(self.genGenderCombo, 1, False)
        else:
            self.comboToggleRow(self.genGenderCombo, 0, True)
            self.comboToggleRow(self.genGenderCombo, 1, True)
            self.comboToggleRow(self.genGenderCombo, 2, False)

    def jsonNamelistChanged(self, index):
        match self.jsonRace:
            case 'Human':
                self.jsonNamelist = self.humanNamelists[index]
            case 'Elf':
                self.jsonNamelist = self.elfNamelists[index]
            case 'Dwarf':
                self.jsonNamelist = self.dwarfNamelists[index]
            case 'Halfing':
                self.jsonNamelist = self.halflingNamelists[index]
            case 'Tiefling':
                self.jsonNamelist = self.tieflingNamelists[index]
            case 'Orc':
                self.jsonNamelist = self.orcNamelists[index]
            case 'Titles':
                self.jsonNamelist = self.titleLists[index]
            case 'Epithets':
                self.jsonNamelist = self.epithetLists[index]
                
        # Gender Selector Reset
        if self.jsonNamelist == 'Virtue':
            self.comboToggleRow(self.jsonNameTypeCombo, 3, True)   
            self.comboToggleRow(self.jsonNameTypeCombo, 0, False)
            self.comboToggleRow(self.jsonNameTypeCombo, 1, False)
            self.comboToggleRow(self.jsonNameTypeCombo, 2, False)
            self.comboToggleRow(self.jsonNameTypeCombo, 3, True)
        elif self.jsonNamelist in self.titleLists or self.jsonNamelist in self.epithetLists:
            self.comboToggleRow(self.jsonNameTypeCombo, 0, True)
            self.comboToggleRow(self.jsonNameTypeCombo, 1, True)
            self.comboToggleRow(self.jsonNameTypeCombo, 3, True)
            self.comboToggleRow(self.jsonNameTypeCombo, 2, False)
        else:
            self.comboToggleRow(self.jsonNameTypeCombo, 0, True)
            self.comboToggleRow(self.jsonNameTypeCombo, 1, True)
            self.comboToggleRow(self.jsonNameTypeCombo, 2, True)
            self.comboToggleRow(self.jsonNameTypeCombo, 3, False)  
    
    # Set gender selection
    def genGenderChanged(self, gender:str):
        self.genGender = gender
    def jsonNameTypeChanged(self, nameType:str):
        self.jsonNameType = nameType
        
    # Check if options should be appended or not
    def genSurnameChanged(self, state):
        self.genSurnameEnabled = state
    def genEpithetChanged(self, checked:bool):
        if checked:
            self.genEpithetCombo.show()
            self.genEpithet = self.genEpithetCombo.currentText()
        else:
            self.genEpithetCombo.hide()
            self.genEpithet = None

    def genTitleChanged(self, checked:bool):
        if checked:
            self.genTitleCombo.show()
            self.genTitle = self.genTitleCombo.currentText()
        else:
            self.genTitleCombo.hide()
            self.genTitle = None
            
    def genTitleTypeChanged(self, titleType):
        self.genTitle = titleType
    
    def genEpithetTypeChanged(self, epithetType):
        self.genEpithet = epithetType
        
    # Name Processing Functions
    def addNames(self):
        addNamesToJson(self.jsonInputBox.toPlainText(), self.jsonNamelist, self.jsonNameType)
    def replaceNames(self):
        addNamesToJson(self.jsonInputBox.toPlainText(), self.jsonNamelist, self.jsonNameType, True)
    def dumpNames(self):
        self.jsonInputBox.clear()
        self.jsonInputBox.appendPlainText(dumpNamesFromJson(self.jsonNamelist, self.jsonNameType))

    # Clears the input box on press
    def clearInputBox(self):
        self.jsonInputBox.clear()
        
    # Hides and disables a row in a combobox dropdown
    def comboToggleRow(self, combo:QComboBox, row:int, show:bool):
        view = combo.view()
        model = combo.model()
        size = combo.count()
        
        # Enable
        if show:
            item = model.item(row)
            item.setFlags(item.flags() | Qt.ItemFlag.ItemIsEnabled)
            view.setRowHidden(row, not show)
            
        # Disable
        else:
            item = model.item(row)
            item.setFlags(item.flags() & ~Qt.ItemFlag.ItemIsEnabled)
            if combo.currentIndex() == row:
                i = 0
                while i < size:
                    item = model.item(i)
                    if item.flags() & Qt.ItemFlag.ItemIsEnabled:
                        combo.setCurrentIndex(i)
                    i += 1
            view.setRowHidden(row, show)

    def musicUpdatePlaying(self):
        pass
    
class AudioPlayer(QMediaPlayer):
    def __init__(self):
        super().__init__()
        self.audioOut = QAudioOutput()
        self.setAudioOutput(self.audioOut)
        self.audioOutput().setVolume(.5)
        self.currentVolume = self.audioOut.volume()
        self.activeTrack = 0
        
        self.mediaStatusChanged.connect(self.detectSongChange)
        
        # Set track list and shuffle
        self.tracks = getMusic()
        if self.tracks is not None:
            random.shuffle(self.tracks)
            self.changeSong()
            self.play()
        
    def play(self):
        super().play()
        
    def pause(self):
        super().pause()
        
    def stop(self):
        super().stop()
        
    def skipForward(self):
        self.stop()
        if self.activeTrack < len(self.tracks)- 1:
            self.activeTrack += 1
        else:
            self.activeTrack = 0
        self.changeSong()
        self.play()
        
    def skipBackward(self):
        self.stop()
        if self.activeTrack < len(self.tracks) - 1 and self.activeTrack > 0:
            self.activeTrack -= 1
        else:
            self.activeTrack = len(self.tracks) - 1
        self.changeSong()
        self.play()
    
    # Change to next song in playlist
    def changeSong(self):
        self.setSource(QUrl.fromLocalFile(self.tracks[self.activeTrack]))
        
    # Checks for when currently playing media changes
    def detectSongChange(self, status):
        if status == QMediaPlayer.MediaStatus.EndOfMedia:
            self.stop()
            
            if self.activeTrack < len(self.tracks)- 1:
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
app.setWindowIcon(QIcon('assets/gui/bruck.png'))

window = Main()
window.show()
app.exec()