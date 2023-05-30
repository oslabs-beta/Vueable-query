import { describe, it, expect } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import QueryEnd from '../Panel/src/components/QueryEnd.vue'
import { createTestingPinia } from '@pinia/testing'
import { useQueryStore } from '../Panel/src/store';
import fs from 'fs';
import path from 'path';

describe('Query End Vue Component', () => {


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
      expect(QueryEnd).toBeTruthy();
    })
    it('mounts properly with initialized store in testing environment', () => {
      const testingPinia = createTestingPinia({
        initialState: {
          query: {data: initialData},
          pageStartTime: 1684991737226
        },
      })
      store = useQueryStore();
      expect(store.data.length).not.toBe(0);

      wrapper = mount(QueryEnd, {
        props: {c: store.endQueries[0]},
        global: {
          plugins: [
            testingPinia,
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
  })
});