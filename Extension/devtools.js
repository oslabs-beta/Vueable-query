chrome.devtools.panels.create("Sample Panel", "icon.png", "panel.html", panel => {
  // code invoked on panel creation
});

chrome.devtools.panels.create("Panel 2", "icon.png", "panel.html", function(panel){});

chrome.devtools.panels.create("My Panel", "icon.png", "index.html", function(panel) {
  panel.onShown.addListener(function(window) {
    var panelWindow = window;
    var panelDocument = panelWindow.document;

    var appFrame = panelDocument.createElement("iframe");
    appFrame.src = chrome.runtime.getURL("index.html");
    appFrame.style.width = "100%";
    appFrame.style.height = "100%";
    appFrame.style.border = "none";

    panelDocument.body.appendChild(appFrame);
  });
});