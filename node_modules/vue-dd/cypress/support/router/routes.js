import Home from './Home.vue'
import Page from './Page.vue'
import About from './About.vue'

export const routes = [
  {
    component: Home,
    name: 'home',
    path: '/',
  },
  {
    component: Page,
    name: 'page',
    path: '/page',
  },
  {
    component: About,
    name: 'about',
    path: '/about',
  }
];
