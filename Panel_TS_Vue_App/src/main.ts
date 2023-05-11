import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')

// Create a connection to the service worker
const backgroundPageConnection = chrome.runtime.connect({
  name: "panel"
});

// report back with tabId to identify devtools location in chrome
backgroundPageConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});

//check querykey and messages for concurrent ones
// background.js -> here

backgroundPageConnection.onMessage.addListener((message: object) => {
    console.log('main.ts: message received at its destination!', message)
});
