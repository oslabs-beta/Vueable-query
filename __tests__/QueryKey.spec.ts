import { describe, it, expect } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useQueryStore } from '../Panel/src/store';
import fs from 'fs';
import path from 'path';
import QueryKey from '../Panel/src/components/QueryKey.vue'
import QueryCacheHitVue from '../Panel/src/components/QueryCacheHit.vue';
import QueryEndVue from '../Panel/src/components/QueryEnd.vue';

describe('Query End Vue Component', () => {
  let initialData: [Message];
  let wrapper: VueWrapper;
  let store: any;
  describe('Testing Setup', () => {
    it('imports the component properly', () => {
      expect(QueryKey).toBeTruthy();
    })

    it('mounts properly with initialized store in testing environment', () => {
      // sets initialData to data.json, which is an array of Messages
      initialData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data.json'), 'utf-8'))
      expect(Array.isArray(initialData)).toBeTruthy()
      const testingPinia = createTestingPinia({
        initialState: {
          query: {data: initialData},
          pageStartTime: 1684991737226
        },
      });
      store = useQueryStore();
      expect(store.data.length).not.toBe(0);

      
      wrapper = mount(QueryKey, {
        props: {queryHash: store.keys[0]},
        global: {
          plugins: [
            testingPinia,
          ],
        },
      }) 
      expect(store.endQueries.length).toBe(4)
    }) 
  })
  describe('displays', () => {
    it('the query hash', () => {
      expect(wrapper.text()).toContain(store.endQueries[0].queryHash)
    })
    it('a Query Cache hit component', () => {
      expect(wrapper.findAllComponents(QueryCacheHitVue).length).toBe(2)
    })
    it('a Query End component', () => {
      expect(wrapper.findAllComponents(QueryEndVue).length).toBe(1)
    })
  })
})