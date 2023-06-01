import { createApp } from 'vue'
import { createPinia } from 'pinia'
// @ts-ignore this is giving ts problems even though the file exists
import App from './App.vue'

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');

import { useQueryStore } from './store'
const store = useQueryStore();

// Create a connection to the service worker
// @ts-ignore : chrome global
const backgroundPageConnection = chrome.runtime.connect();

// report back with tabId to identify devtools location in chrome
backgroundPageConnection.postMessage({
  name: 'init',
  // @ts-ignore : chrome global
  tabId: chrome.devtools.inspectedWindow.tabId
});

//check querykey and messages for concurrent ones
// background.js -> here
backgroundPageConnection.onMessage.addListener((message: Message) => {

  const { startTime, type} = message.payload;
  if(type === 'pageStartTime') {
    store.setPageStartTime(startTime)
  } else {
    store.addNewQuery(message);
  }
});
