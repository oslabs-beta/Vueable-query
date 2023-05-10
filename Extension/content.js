//content script
console.log('hello world 4')

if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded',afterDOMLoaded);
} else {
  afterDOMLoaded();
}

function afterDOMLoaded(){
  console.log('Dom Content loaded')
  
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL('script.js');
  s.onload = function() { this.remove(); };
  (document.head || document.documentElement).appendChild(s);

}


