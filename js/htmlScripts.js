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

// Creates the top/navbar on each page
function createConstantElements()
{
  includeHTML('html/modular/topbar.html', 'topbar');
  includeHTML('html/modular/sidebar.html', 'navbar');
}

// Constructs the frontend for the generator page - varies based on passed genType
function createGeneratorUI()
{
  const config = getJson('assets/namelists/config.json');
  let visible = false;

  // Check if the config is per list or per subfolder
  let list = localStorage.getItem('root') + '/' + localStorage.getItem('subfolder') + '/' + localStorage.getItem('list');;
  if(config[list] == undefined)
  {
    list = localStorage.getItem('root') + '/' + localStorage.getItem('subfolder');
  }
  
  try
  {
    includeHTML('html/modular/generatorInterface.html', 'generatorinterface');

    // Hide all controls if no configurations
    if( (config[list]['select1'].length == 0 || config[list]['select1'] == undefined) &&
        (config[list]['select2'].length == 0 || config[list]['select2'] == undefined) &&
        (config[list]['checkbox1'].length == 0 || config[list]['checkbox1'] == undefined) &&
        (config[list]['select4'].length == 0 || config[list]['select4'] == undefined) &&
        (config[list]['select5'].length == 0 || config[list]['select5'] == undefined) )
    {
      var observer = new MutationObserver(function (mutations, me) {
        var controls = document.getElementById('controls');
        if(controls) {
          setVisibility('controls', visible);
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
      selectInit('select1label', 'select1', config[list]['select1']);
      selectInit('select2label', 'select2', config[list]['select2']);
      checkInit('checkbox1label', 'checkbox1', config[list]['checkbox1']);
      selectInit('select4label', 'select4', config[list]['select4']);
      selectInit('select5label', 'select5', config[list]['select5']);
    }
    
    // Wait until title is created and then set it
    var observer = new MutationObserver(function (mutations, me) {
      var title = document.getElementById('gentitle');
      if (title) {
        document.getElementById('gentitle').textContent = localStorage.getItem('pageTitle');
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
    includeHTML('html/modular/topbar.html', 'topbar');
    includeHTML('html/modular/navbar.html', 'navbar');
    includeHTML('html/modular/error.html', 'generatorinterface')
  }
}

// Set dropdown options
function setSelectContent(selectid, contentList)
{
  let select = document.getElementById(selectid);
  let i = 0;

  let indexArr = arrayCheckForSubstring(contentList, '-')
  if(indexArr.length != 0)
  {
    let pathSplit = [];
    let path = '';
    let newContent = [];

    for(i = 0; i < indexArr.length; i++)
    {
      pathSplit = contentList[indexArr[i]].split('-');
      path = 'assets/namelists/' + pathSplit[0] + '/';
      for(let j = 1; j < pathSplit.length - 1; j++)
      {
        path += pathSplit[j] + '/';
      }
      path = path.slice(0, -1) + '.json'; // remove last /
      data = getJson(path);
      newContent = getNestedKey(data, pathSplit.at(-1));
    }
    contentList = newContent;
  }

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

// Dropdown initializer
function selectInit(labelid, selectid, configList)
{
  var observer = new MutationObserver(function (mutations, me) {
    var dd = document.getElementById(selectid);
    if (dd) {
      if(configList.length != 0)
      {
        setSelectContent(selectid, configList.slice(1));
        document.getElementById(labelid).textContent = configList[0];
        visible = true;
      }
      else
      {       
        visible = false;
      }
      setVisibility(labelid, visible);
      setVisibility(selectid, visible);
      me.disconnect();
      return;
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true
  });
}

// Checkbox initializer
function checkInit(labelid, checkid, configList)
{
  var observer = new MutationObserver(function (mutations, me) {
    var dd = document.getElementById(checkid);
    if (dd) {
      if(configList.length != 0)
      {
          if(configList[1] == 'false')
          {
            document.getElementById(checkid).checked = false;
          }
          else
          {
            document.getElementById(checkid).checked = true;
          }
          visible = true;
          document.getElementById(labelid).textContent = configList[0];
      }
      else
      {       
        visible = false;
      }
      setVisibility(labelid, visible);
      setVisibility(checkid, visible);
      me.disconnect();
      return;
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true
  });
}

// Checks if the passed substring exists in any element in the array
function arrayCheckForSubstring(arr, substring)
{
  indexList = []
  for(let i = 0; i < arr.length; i++)
  {
    if(arr[i].includes(substring))
      indexList.push(i);
  }
  return indexList;
}

// Updates dropdown dynamically if needed
function updateSelectContent(selectid)
{
  const page = localStorage.getItem('root') + '/' + localStorage.getItem('subfolder') + '/' + localStorage.getItem('list');
  switch(page)
  {
    case 'fantasy/locations/settlements':
      if(selectid == 'select1')
      {
        let contentList = ['fantasy-util-sets-lists.' + document.getElementById(selectid).value.toLowerCase()];
        setSelectContent('select2', contentList);
      }
      break;
    case 'fantasy/locations/realms':
      if(selectid == 'select1')
      {
        let contentList = ['fantasy-util-sets-lists.' + document.getElementById(selectid).value.toLowerCase()];
        setSelectContent('select2', contentList);
      }
      break;

    default:
      break;
  }
}