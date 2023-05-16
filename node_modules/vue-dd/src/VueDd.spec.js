import VueDd from './VueDd.vue';
import { flushPromises } from '@vue/test-utils'

import { routes } from '../cypress/support/router/routes.js'
import { createMemoryHistory, createRouter, createWebHistory, useRoute } from 'vue-router'
// beforeEach(() => {
//   cy.mount(VueDd);
// });

// it('basic router', () => {
//   // cy.wrap(Cypress.router.push('/'))
//   // cy.getDataCy('home').should('not.be.visible');
//   const name = 'test';
//
//   cy.mount(VueDd, {
//     props: {
//       modelValue: true,
//       name,
//     },
//   });
//
//   // cy.log('test')
//   // cy.location('pathname').should('eq', '/');
//   cy.get('div.vue-dd').should('have.text', name + ':true');
// });

it('router changed', async () => {
  // cy.wrap(Cypress.router.push('/'))
  // cy.getDataCy('home').should('not.be.visible');
  const router = createRouter({
    routes: routes,
    history: createWebHistory(),
  })


  // Change location to `/login`,
  // and await on the promise with cy.wrap
  cy.wrap(router.push('/about')).then(() => {

    cy.log('currentRoute', JSON.stringify(router.currentRoute))

    // Pass the already initialized router for use
    const name = 'test';

    cy.mount(VueDd, {
      router,
      props: {
        modelValue: true,
        delimiter: '$',
        name,
      },
    });

    const route = useRoute()

    cy.log('route', JSON.stringify(route))

    cy.log(JSON.stringify(window.location))
    // cy.location('pathname').should('eq', '/');
    cy.get('#dd_1').should('have.length', 1)
    cy.get('#dd_1').should('have.text', 'test:true')
    // cy.get('#_dd_1').contains(name);

  })
});
//
// it('window', () => {
//   // cy.wrap(Cypress.router.push('/'))
//   // cy.location('pathname').should('eq', '/');
//   // cy.getDataCy('home').should('not.be.visible');
//   const name = 'test';
//
//   cy.mount(VueDd, {
//     props: {
//       modelValue: window,
//       name,
//       focus: 'crypto'
//     },
//   });
//   // cy.get('body').invoke('html').then((val) => console.log(JSON.stringify(val)))
//   console.log('yes')
//   cy.get(`#${CSS.escape('_dd_1.cypress')}`).should('be.visible');
// });

//
// it('shows a navbar on board detail', () => {
//   // cy.wrap(Cypress.router.push('/board/1'));
//   // cy.location('pathname').should('eq', '/board/1');
//   cy.getDataCy('home').should('be.visible');
// });
