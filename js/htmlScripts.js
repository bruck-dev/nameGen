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
  try
  {
    includeHTML('html/modular/generatorInterface.html', 'generatorinterface');

    uniqueConfigs = ['f-unq'];

    // The unique config type has no options to set, so disable the interface
    if(uniqueConfigs.includes(configType))
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
      // Wait until the opt1 dropdown has been fully created before appending new elements.
      var observer = new MutationObserver(function (mutations, me) {
        var dd = document.getElementById('opt1select');
        if (dd) {
          setOpt1(configType, genType);
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
  contentList = [];
  switch(config)
  {
    // Configure for fantasy races - setup subraces. No need to change label.
    case 'f-race':
      switch(genType)
      {
        case 'human':
          contentList = ['Western', 'Eastern', 'Northern'];
          setSelectContent('opt1select', contentList);
          break;
        case 'elf':
          contentList = ['High Elf', 'Wood Elf', 'Dark Elf', 'Drow'];
          setSelectContent('opt1select', contentList);
          break;
        case 'dwarf':
          contentList = ['Dwarf'];
          setSelectContent('opt1select', contentList);
          break;
        case 'halfling':
          contentList = ['Halfling'];
          setSelectContent('opt1select', contentList);
          break;
        case 'tiefling':
            contentList = ['Infernal', 'Virtue'];
            setSelectContent('opt1select', contentList);
            break;
        case 'orc':
          contentList = ['Orc'];
          setSelectContent('opt1select', contentList);
          break;
      }
    case 'f-location':
      switch(genType)
      {
        case 1:
          break;
        case 2:
          break;
      }
  }
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