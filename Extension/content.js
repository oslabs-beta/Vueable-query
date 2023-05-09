//devtool creation should go in devtools.js

// chrome.devtools.panels.create("test","icon.png" ,
//     "index.html", function(panel){
//       console.log(panel);
//     });

// chrome.devtools.panels.create("My Panel", "icon.png", "index.html", function(panel) {
//   panel.onShown.addListener(function(window) {
//     var panelWindow = window;
//     var panelDocument = panelWindow.document;

//     var appFrame = panelDocument.createElement("iframe");
//     appFrame.src = chrome.runtime.getURL("index.html");
//     appFrame.style.width = "100%";
//     appFrame.style.height = "100%";
//     appFrame.style.border = "none";

//     panelDocument.body.appendChild(appFrame);
//   });
// });