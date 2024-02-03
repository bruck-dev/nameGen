/**
 * @summary HTML Scripting Handler File
 * @description Contains all JS functions used on the web app to manipulate the HTML of the front end..
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
function createNavbar()
{
  includeHTML('html/modular/navbar.html', 'navbar');
}
// Constructs the frontend for the generator page - varies based on passed genType
function createGeneratorUI(genType)
{
  try
  {
    includeHTML('html/modular/generatorInterface.html', 'generatorinterface');

    // Wait until the subrace dropdown has been fully created before appending new elements.
    var observer = new MutationObserver(function (mutations, me) {
      var dd = document.getElementById('subraceselect');
      if (dd) {
        setSubrace(genType);
        me.disconnect();
        return;
      }
    });
    observer.observe(document, {
      childList: true,
      subtree: true
    });

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

function setSubrace(race)
{
  subrace = document.getElementById('subraceselect');

  for(let i = subrace.options.length - 1; i >= 0 ; i--)
  {
    subrace.remove(i);
  }

  subraceList = [];
  
  switch(race)
  {
    case "human":
      subraceList = ['Western', 'Eastern', 'Northern'];
      break;
    case "elf":
      subraceList = ['High Elf', 'Wood Elf', 'Dark Elf', 'Drow'];
      break;
    case "dwarf":
      subraceList = ['Dwarf'];
      break;
    case "halfling":
      subraceList = ['Halfling'];
      break;
    case "tiefling":
        subraceList = ['Infernal', 'Virtue'];
        break;
    case "orc":
      subraceList = ['Orc'];
      break;
  }

  for(i = 0; i < subraceList.length; i++)
  {
    let opt = subraceList[i];
    let element = document.createElement('option');
    element.textContent = opt;
    element.value = opt;
    subrace.appendChild(element);
  }
}

function setPageTitle(genType)
{
  genType = genType.charAt(0).toUpperCase() + genType.slice(1); // Capitalize first letter because I didn't have the foresight to do this earlier
  document.getElementById('gentitle').textContent = genType + ' Namelists';
}