chrome.devtools.panels.create("Vueable Query", "icon.png", "panel.html", panel => {
  // code invoked on panel creation
  console.log(panel);
});
//chrome api listens for messages sent by observer