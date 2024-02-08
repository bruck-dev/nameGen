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
function createGeneratorUI()
{
  const config = getJson('assets/namelists/' + localStorage.getItem('root') + '/' + localStorage.getItem('subfolder') + '/config.json');
  const opt1 = config['opt1'];
  const opt2 = config['opt2'];
  const opt3 = config['opt3'];
  const opt4 = config['opt4'];
  const opt5 = config['opt5'];
  let visible = false;
  const list = localStorage.getItem('list');
  try
  {
    includeHTML('html/modular/generatorInterface.html', 'generatorinterface');

    // Hide all controls
    if( (opt1.length == 0) &&
        (opt2.length == 0) &&
        (opt3.length == 0) &&
        (opt4.length == 0) &&
        (opt5.length == 0) )
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
      // Configure opt1
      var observer = new MutationObserver(function (mutations, me) {
        var dd = document.getElementById('opt1select');
        if (dd) {
          if(opt1.length != 0)
          {
            if(opt1[0].includes('/') && !opt1[0].includes('/' + list))
            {
              visible = false;
            }
            else
            {
              setSelectContent('opt1select', opt1.slice(1));
              visible = true;
              if(opt1[0].includes('/'))
              {
                document.getElementById('opt1').textContent = opt1[0].substring(0, opt1[0].indexOf('/'));
              }
              else
              {
                document.getElementById('opt1').textContent = opt1[0];
              }
            }
          }
          else
          {       
            visible = false;
          }
          setVisibility('opt1', visible);
          setVisibility('opt1select', visible);
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
          if(opt2.length != 0)
          {
            if(opt2[0].includes('/') && !opt2[0].includes('/' + list))
            {
              visible = false;
            }
            else
            {
              setSelectContent('opt2select', opt2.slice(1));
              visible = true;
              if(opt2[0].includes('/'))
              {
                document.getElementById('opt2').textContent = opt2[0].substring(0, opt2[0].indexOf('/'));
              }
              else
              {
                document.getElementById('opt2').textContent = opt2[0];
              }
            }
          }
          else
          {       
            visible = false;
          }
          setVisibility('opt2', visible);
          setVisibility('opt2select', visible);
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
          if(opt3.length != 0)
          {
            if(opt3[0].includes('/') && !opt3[0].includes('/' + list))
            {
              visible = false;
            }
            else
            {
              if(opt3[1] == 'false')
              {
                document.getElementById('opt3').checked = false;
              }
              else
              {
                document.getElementById('opt3').checked = true;
              }
              if(opt3[0].includes('/'))
              {
                document.getElementById('opt3').textContent = opt3[0].substring(0, opt3[0].indexOf('/'));
              }
              else
              {
                document.getElementById('opt3').textContent = opt3[0];
              }
              visible = true;
            }
          }
          else
          {       
            visible = false;
          }
          setVisibility('opt3', visible);
          setVisibility('opt3check', visible);
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
          if(opt4.length != 0)
          {
            if(opt4[0].includes('/') && !opt4[0].includes('/' + list))
            {
              visible = false;
            }
            else
            {
              setSelectContent('opt4select', opt4.slice(1));
              visible = true;
              if(opt4[0].includes('/'))
              {
                document.getElementById('opt4').textContent = opt4[0].substring(0, opt4[0].indexOf('/'));
              }
              else
              {
                document.getElementById('opt4').textContent = opt4[0];
              }
            }
          }
          else
          {       
            visible = false;
          }
          setVisibility('opt4', visible);
          setVisibility('opt4select', visible);
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
          if(opt5.length != 0)
          {
            if(opt5[0].includes('/') && !opt5[0].includes('/' + list))
            {
              visible = false;
            }
            else
            {
              setSelectContent('opt5select', opt5.slice(1));
              visible = true;
              if(opt5[0].includes('/'))
              {
                document.getElementById('opt5').textContent = opt5[0].substring(0, opt5[0].indexOf('/'));
              }
              else
              {
                document.getElementById('opt5').textContent = opt5[0];
              }
            }
          }
          else
          {       
            visible = false;
          }
          setVisibility('opt5', visible);
          setVisibility('opt5select', visible);
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
    includeHTML('html/modular/navbar.html', 'navbar');
    includeHTML('html/modular/error.html', 'generatorinterface')
  }
}

function setSelectContent(selectid, contentList)
{
  let select = document.getElementById(selectid);
  let i = 0;

  let indexArr = arrayCheckForSubstring(contentList, 'root-')
  if(indexArr.length != 0)
  {
    let pathSplit = [];
    let path = '';
    let newContent = [];

    for(i = 0; i < indexArr.length; i++)
    {
      path = 'assets/namelists/' + localStorage.getItem('root') + '/';
      pathSplit = contentList[indexArr[i]].split('-');
      for(let j = 1; j < pathSplit.length - 1; j++)
      {
        path += pathSplit[j] + '/';
      }
      newContent = newContent.concat(getJson(path + 'config.json')[pathSplit.at(-1)]);
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