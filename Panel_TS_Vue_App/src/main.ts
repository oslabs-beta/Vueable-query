import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')


import { useQueryStore } from './store'
const store = useQueryStore();

// Create a connection to the service worker
// @ts-ignore : chrome global
const backgroundPageConnection = chrome.runtime.connect({
  name: "panel"
});

// report back with tabId to identify devtools location in chrome
backgroundPageConnection.postMessage({
  name: 'init',
  // @ts-ignore : chrome global
  tabId: chrome.devtools.inspectedWindow.tabId
});

//check querykey and messages for concurrent ones
// background.js -> here

backgroundPageConnection.onMessage.addListener((message: Message) => {
  console.log('got a message in main.ts: ', message)
  const { startTime, endTime, type, event } = message.payload;
  if(type === 'pageStartTime') {
    store.addPageStartTime(message.payload.startTime)
  } else if (type === 'resetHistory') {
    store.resetHistory();
  } else {
    console.log('main.ts: message received at its destination!', startTime, endTime, type, event.query.queryHash, message);
    store.addNewQuery(message);
  }
});
