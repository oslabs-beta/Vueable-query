import { mount } from '@cypress/vue'
// import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter, useRoute } from 'vue-router'
import { routes } from './router/routes.js';
// import { useStore } from '@/store/store';
// import VueClickAway from 'vue3-click-away';
// import './common'
import '../../src/css/VueDd.css';
import '../../src/css/VueDd.code.css';

// type MountParams = Parameters<typeof mount>
// type OptionsParam = MountParams[1]

// declare global {
//   namespace Cypress {
//     interface Chainable {
//       mount(
//         component: any,
//         options?: OptionsParam & { store?: any }
//       ): Chainable<any>
//     }
//   }
// }

// solution #1 👇 - does not throw error, but doesn’t show component
Cypress.Commands.add('mount', (component, options = {}) => {

  // let pinia = createPinia()
  let router = createRouter({
    routes,
    history: createMemoryHistory()
  })

  // define default route


  // let store = options.store || useStore(pinia)

  const installRouter = (app) => {
    app.use(router)
  }

  options = {
    global: {
      plugins: [/*store*/installRouter]
    },
    ...options
  }

  options.path && cy.wrap(router.push({name:options.path}))

  cy.log(options.path)
  cy.log(JSON.stringify(router))

  // delete options.path
  return mount(component, options)

})

Cypress.Commands.add('isWithinViewport', { prevSubject: true }, (subject) => {
  const rect = subject[0].getBoundingClientRect();

  expect(rect.top).to.be.within(0, window.innerHeight);
  expect(rect.right).to.be.within(0, window.innerWidth);
  expect(rect.bottom).to.be.within(0, window.innerHeight);
  expect(rect.left).to.be.within(0, window.innerWidth);

  return subject;
});

Cypress.Commands.add('isOutsideViewport', { prevSubject: true }, (subject) => {
  const rect = subject[0].getBoundingClientRect();

  expect(rect.top).not.to.be.within(0, window.innerHeight);
  expect(rect.right).not.to.be.within(0, window.innerWidth);
  expect(rect.bottom).not.to.be.within(0, window.innerHeight);
  expect(rect.left).not.to.be.within(0, window.innerWidth);

  return subject;
});
