import { describe, it, expect } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import QueryCacheHit from '../Panel/src/components/QueryCacheHit.vue'
import { createTestingPinia } from '@pinia/testing'
import { useQueryStore } from '../Panel/src/store';
import fs from 'fs';
import path from 'path';

describe('Query Cache Hit Vue Component', () => {

  let initialData: [Message];
  let wrapper: VueWrapper;
  let store: any;
  describe('Testing Setup', () => {
    it('imports the component properly', () => {
      expect(QueryCacheHit).toBeTruthy();
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
      wrapper = mount(QueryCacheHit, {
        props: {c: store.cacheQueries[0]},
        global: {
          plugins: [
            testingPinia,
          ],
        },
      }) 
    }) 
  })
  describe('displays', () => {
    it('the query hash', () => {
      expect(wrapper.text()).toContain(store.cacheQueries[0].queryHash)
    })
    it('the start time', () => {
      expect(wrapper.text()).toContain(store.cacheQueries[0].startTime)
    })
  })
})