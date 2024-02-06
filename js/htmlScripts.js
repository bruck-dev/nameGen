/**
 * @summary HTML Scripting Handler File
 * @description Contains all JS functions used on the web app to manipulate the HTML of the front end.
 * @author bruck
 * 
 * @version  0.1.A
 */

// Places the passed HTML file at the location of the passed element, i.e. puts the navbar in <div id='navbar'>
function includeHTML(html, element)
{
  fetch(html)
  .then(response => response.text())
  .then(text => document.getElementById(element).innerHTML = text);
}

// Toggles visibility of element
function setVisibility(element, visible)
{
  if(visible)
  {
    document.getElementById(element).style.display = '';
  }

  else
  {
    document.getElementById(element).style.display = 'none';
  }
}

// Creates the navbar on each page
function createConstantElements()
{
  includeHTML('html/modular/topbar.html', 'topbar');
  includeHTML('html/modular/sidebar.html', 'navbar');
}

// Constructs the frontend for the generator page - varies based on passed genType
function createGeneratorUI(configType, genType)
{

  optionsEnabled = getConfigurationOptions(configType);
  optionsLabels = getConfigurationLabels(configType);
  let checker = arr => arr.every(v => v === false);

  try
  {
    includeHTML('html/modular/generatorInterface.html', 'generatorinterface');

    // Hide all controls
    if(checker(optionsEnabled))
    {
      var observer = new MutationObserver(function (mutations, me) {
        var controls = document.getElementById('controls');
        if(controls) {
          setVisibility('controls', false);
          me.disconnect();
          return;
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true
      });
    }

    else
    {
      // Configure opt1 (wait until created)
      var observer = new MutationObserver(function (mutations, me) {
        var dd = document.getElementById('opt1select');
        if (dd) {
          setOpt1(configType, genType);
          setVisibility('opt1', optionsEnabled[0]);
          setVisibility('opt1select', optionsEnabled[0]);
          document.getElementById('opt1').textContent = optionsLabels[0];
          me.disconnect();
          return;
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true
      });

      // Configure opt2
      var observer = new MutationObserver(function (mutations, me) {
        var dd = document.getElementById('opt2select');
        if (dd) {
          setOpt2(configType, genType);
          setVisibility('opt2', optionsEnabled[1]);
          setVisibility('opt2select', optionsEnabled[1]);
          document.getElementById('opt2').textContent = optionsLabels[1];
          me.disconnect();
          return;
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true
      });

      // Configure opt3
      var observer = new MutationObserver(function (mutations, me) {
        var dd = document.getElementById('opt3check');
        if (dd) {
          setVisibility('opt3', optionsEnabled[2]);
          setVisibility('opt3check', optionsEnabled[2]);
          document.getElementById('opt3').textContent = optionsLabels[2];
          me.disconnect();
          return;
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true
      });

      // Configure opt4
      var observer = new MutationObserver(function (mutations, me) {
        var dd = document.getElementById('opt4select');
        if (dd) {
          setOpt4(configType, genType);
          setVisibility('opt4', optionsEnabled[3]);
          setVisibility('opt4select', optionsEnabled[3]);
          document.getElementById('opt4').textContent = optionsLabels[3];
          me.disconnect();
          return;
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true
      });

      // Configure opt5
      var observer = new MutationObserver(function (mutations, me) {
        var dd = document.getElementById('opt5select');
        if (dd) {
          setOpt5(configType, genType);
          setVisibility('opt5', optionsEnabled[4]);
          setVisibility('opt5select', optionsEnabled[4]);
          document.getElementById('opt5').textContent = optionsLabels[4];
          me.disconnect();
          return;
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true
      });
    }
    
    // Wait until title is created and then set it
    var observer = new MutationObserver(function (mutations, me) {
      var title = document.getElementById('gentitle');
      if (title) {
        setPageTitle(genType);
        me.disconnect();
        return;
      }
    });
    observer.observe(document, {
      childList: true,
      subtree: true
    });

  }
  catch(error)
  {
    includeHTML('html/modular/navbar.html', 'navbar');
    includeHTML('html/modular/error.html', 'generatorinterface')
  }
}

// Sets the first dropdown based on passed config type and generator type. Generally used for subraces.
function setOpt1(config, genType)
{
  let contentList = [];
  switch(config)
  {
    // Configure for fantasy races - setup subraces. No need to change label.
    case 'f-race':
      switch(genType)
      {
        case 'human':
          contentList = ['Western', 'Eastern', 'Northern'];
          break;
        case 'elf':
          contentList = ['High Elf', 'Wood Elf', 'Dark Elf', 'Drow'];
          break;
        case 'dwarf':
          contentList = ['Dwarf'];
          break;
        case 'halfling':
          contentList = ['Halfling'];
          break;
        case 'tiefling':
            contentList = ['Infernal', 'Virtue'];
            break;
        case 'orc':
          contentList = ['Orc'];
          break;
      }
      break;
    case 'f-loc':
      contentList = ['Human', 'Elf', 'Dwarf', 'Orc'];
      break;
    case 'f-nat':
      switch(genType)
      {
        case 'nature':
          contentList = ['Arctic', 'Arid', 'Freshwater', 'Rocky', 'Saltwater', 'Swampy', 'Temperate'];
          break;
      }
      break;
    case 'f-org':
      switch(genType)
      {
        case 'guild':
          contentList = ['Merchant', 'Adventurer', 'Mage', 'Criminal', 'Assassin'];
      }
      break;
  }

  // Sorts alphabetically but puts 'None' at front (for default) if present
  contentList = contentList.sort();
  if(contentList.includes('None'))
  {
    if (contentList.indexOf('None') > 0) {
      contentList.splice(contentList.indexOf('None'), 1);
      contentList.unshift('None');
    }
  }
  setSelectContent('opt1select', contentList)
}

// Sets the second dropdown based on passed config type and generator type. Generally used for gender.
function setOpt2(config, genType)
{
  let contentList = [];
  switch(config)
  {
    // Configure for fantasy races - setup subraces. No need to change label.
    case 'f-race':
      contentList = ['Male', 'Female'];
      break;

    case 'f-loc':
      switch(genType)
      {
        case 'settlement':
          contentList = ['Tiny', 'Small', 'Medium', 'Large'];
          break;
        case 'realm':
          contentList = ['Kingdom', 'Duchy', 'County'];
          break;
      }
      break;
  }

  // Sorts alphabetically but puts 'None' at front (for default) if present
  contentList = contentList.sort();
  if(contentList.includes('None'))
  {
    if (contentList.indexOf('None') > 0) {
      contentList.splice(contentList.indexOf('None'), 1);
      contentList.unshift('None');
    }
  }
  setSelectContent('opt2select', contentList);
}

// Sets the 4th dropdown based on passed config type and generator type. Generally used for gender.
function setOpt4(config, genType)
{
  let contentList = [];
  switch(config)
  {
    // Configure for fantasy races - setup subraces. No need to change label.
    case 'f-race':
      contentList = ['None', 'Military', 'Nobility', 'Religious', 'Magical'];
      break;
  }
  // Sorts alphabetically but puts 'None' at front (for default) if present
  contentList = contentList.sort();
  if(contentList.includes('None'))
  {
    if (contentList.indexOf('None') > 0) {
      contentList.splice(contentList.indexOf('None'), 1);
      contentList.unshift('None');
    }
  }
  setSelectContent('opt4select', contentList);
}

// Sets the 5th dropdown based on passed config type and generator type. Generally used for gender.
function setOpt5(config, genType)
{
  let contentList = [];
  switch(config)
  {
    // Configure for fantasy races - setup subraces. No need to change label.
    case 'f-race':
      contentList = ['None', 'Animals', 'Nicknames', 'Sobriquets', 'Suffixes'];
      break;
  }

  // Sorts alphabetically but puts 'None' at front (for default) if present
  contentList = contentList.sort();
  if(contentList.includes('None'))
  {
    if (contentList.indexOf('None') > 0) {
      contentList.splice(contentList.indexOf('None'), 1);
      contentList.unshift('None');
    }
  }
  setSelectContent('opt5select', contentList);
}

function setSelectContent(selectid, contentList)
{
  let select = document.getElementById(selectid);

  for(let i = select.options.length - 1; i >= 0 ; i--)
  {
    select.remove(i);
  }

  for(i = 0; i < contentList.length; i++)
  {
    let opt = contentList[i];
    let element = document.createElement('option');
    element.textContent = opt;
    element.value = opt;
    select.appendChild(element);
  }
}

// Sets the namelist title depending on passed namelist
function setPageTitle(genType)
{
  genType = genType.replaceAll('-', ' ');
  document.getElementById('gentitle').textContent = genType + ' namelists';
  document.getElementById('gentitle').style.textTransform = "capitalize";
}

// Returns an array of enabled options
function getConfigurationOptions(configType)
{
  switch(configType)
  {
    case 'f-race':
      return [true, true, true, true, true];
    case 'f-unq':
      return [false, false, false, false, false];
    case 'f-org':
      return [true, false, false, false, false];
    case 'f-loc':
      return [true, true, false, false, false];
    case 'f-nat':
      return [true, false, false, false, false];
  }
}

// Returns an array of option labels
function getConfigurationLabels(configType)
{
  switch(configType)
  {
    case 'f-race':
      return ['Subrace', 'Gender', 'Surname', 'Title', 'Epithet'];
    case 'f-unq':
      return [false, false, false, false, false];
    case 'f-org':
      return ['Background', false, false, false, false];
    case 'f-loc':
      return ['Race', 'Size', false, false, false];
    case 'f-nat':
      return ['Climate', false, false, false, false];
  }
}