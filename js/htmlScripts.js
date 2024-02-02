function includeHTML(html, element)
{
  fetch(html)
  .then(response => response.text())
  .then(text => document.getElementById(element).innerHTML = text);
}