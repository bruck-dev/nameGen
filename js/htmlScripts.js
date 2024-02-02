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
    includeHTML('html/modular/generatorSettings.html', 'generatorsettings');
  }
  catch(error)
  {
    includeHTML('html/modular/navbar.html', 'navbar');
    includeHTML('html/modular/error.html', 'generatorblock')
  }
}