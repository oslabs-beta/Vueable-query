import { describe, it, expect } from 'vitest'

import { VueWrapper, mount } from '@vue/test-utils'
import Timeline from '../Timeline.vue'
import { createTestingPinia } from '@pinia/testing'
// import any store you want to interact with in tests
// import { useSomeStore } from '@/stores/myStore'
import { useQueryStore } from '../../store';
import fs from 'fs';
import path from 'path';
import { flushPromises } from '@vue/test-utils';

// initialize 'global' variables for tests
let initialData: [Message];
let wrapper: VueWrapper;
let store: any;


describe('store', () => {
  it('reads from file properly', () => {
    // sets initialData to data.json, which is an array of Messages
    initialData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data.json'), 'utf-8'))
  })
  it('gets data of type array', () => {
    expect(Array.isArray(initialData)).toBeTruthy()
    expect(initialData.length).not.toBe(0);
  })
});

describe('Timeline', async () => {
  it('imports properly', () => {
    expect(Timeline).toBeTruthy();
  })
  it('mounts properly with initialized store in testing environment', () => {
    // we have to manually attach the wrapped element to the DOM
    // https://stackoverflow.com/questions/49820828/during-testing-a-vue-component-in-jest-document-queryselector-always-returns-nul/49821140#49821140
    // https://stackoverflow.com/questions/65664412/vue-test-utils-returns-null-for-document-queryselector
    const elem = document.createElement('div')
    if (document.body) {
      document.body.appendChild(elem)
    }
    // mounts Timeline and defines initalState for Pinia 'query' store
    wrapper = mount(Timeline, {
      attachTo: elem,
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              query: {data: initialData},
            },
          }),
        ],
      },
    }) 

    // this store is the same testing store initalized above
    store = useQueryStore();
    expect(store.data.length).not.toBe(0);

  }) 
  it('store initalizes with data of type array', () => {
    expect(Array.isArray(store.endQueries)).toBeTruthy()
    expect(Array.isArray(store.cacheQueries)).toBeTruthy()
  })
  it('displays keys', async () => {
    // await flushPromises();
    // console.log('html', wrapper.html());
    expect(wrapper.findAll('text')[0].text()).toBe('["posts"]')
    expect(wrapper.findAll('text')[1].text()).toBe('["post",1]')
    expect(wrapper.findAll('text')[2].text()).toBe('["post",2]')
    expect(wrapper.findAll('text')[3].text()).toBe('["post",3]')
  })
});
// const wrapper = mount(Timeline, {
//   global: {
//     plugins: [
//       createTestingPinia({
//         initialState: {
//           counter: { n: 20 }, // start the counter at 20 instead of 0
//         },
//       }),
//     ],
//   },
// })
// const store = useQueryStore() // uses the testing pinia!

// 1684991737226
// // // state can be directly manipulated
// // store.name = 'my new name'
// // // can also be done through patch
// // store.$patch({ name: 'new name' })
// // expect(store.name).toBe('new name')

// describe('Timeline', () => {
//   it('renders properly', () => {
//     expect(wrapper.text()).toContain('Hello Vitest')
//   })
// })