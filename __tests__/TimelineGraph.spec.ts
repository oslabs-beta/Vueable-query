import { describe, it, expect } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import TimelineGraph from '../Panel/src/components/TimelineGraph.vue'
import { createTestingPinia } from '@pinia/testing'
import { useQueryStore } from '../Panel/src/store';
import fs from 'fs';
import path from 'path';

describe('Timeline Vue Component', () => {
  // initialize 'global' variables for tests
  let initialData: [Message];
  let wrapper: VueWrapper;
  let store: any;
  describe('Testing Setup', () => {
    it('reads from file properly', () => {
      // sets initialData to data.json, which is an array of Messages
      initialData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data.json'), 'utf-8'))
    })
    it('gets 6 sample data messages in an array', () => {
      expect(Array.isArray(initialData)).toBeTruthy()
      expect(initialData.length).not.toBe(0);
      expect(initialData.length).toBe(6);
    })
    it('imports the component properly', () => {
      expect(TimelineGraph).toBeTruthy();
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
      wrapper = mount(TimelineGraph, {
        attachTo: elem,
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                query: {data: initialData},
                // also should initialize start time
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
    it('Timeline template appears on the dom', () => {
      expect(document.getElementById('graph')).toBeTruthy();
    })
  })
  describe('d3 graph', () => {
    it('displays keys in order', async () => {
      // console.log('html', wrapper.html());
      expect(wrapper.findAll('text')[0].text()).toBe('["posts"]')
      expect(wrapper.findAll('text')[1].text()).toBe('["post",1]')
      expect(wrapper.findAll('text')[2].text()).toBe('["post",2]')
      expect(wrapper.findAll('text')[3].text()).toBe('["post",3]')
    })
    it('displays rect datapoints for each query', async () => {
      expect(wrapper.findAll('rect').length).toBe(6);
    })
  })
});
