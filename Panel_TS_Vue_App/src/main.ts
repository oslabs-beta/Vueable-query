import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())

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

interface MessageSender {
    tab?: any, // ideally also define tab
    frameId?: number,
    id?: string,
    url?: string,
    tlsChannelId?: string,
}
backgroundPageConnection.onMessage.addListener((message: object, sender: MessageSender) => {
    console.log('message received at its destination!', message, sender)
});

console.log('panel main.ts: tabId:', chrome.devtools.inspectedWindow.tabId);
